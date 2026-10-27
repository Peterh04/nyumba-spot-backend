import EmailVerification from "../models/EmailVerification.js";
import OtpRateLimit from "../models/OtpRateLimit.js";
import User from "../models/User.js";
import issueEmailVerification from "../services/otpServices.js";
import hashOTP from "../utils/hashOTP.js";
import checkIntegerFields from "../utils/validation/checkIntegerFields.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";

export const verifyOTP = async (req, res) => {
  try {
    const { OTP, email } = req.body;

    const requiredFields = {
      email,
      OTP,
    };

    const stringFields = {
      email,
    };

    const invalidRequiredFields = checkRequiredFields(requiredFields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    const invaidStringFields = checkStringFields(stringFields);

    if (invaidStringFields.length > 0)
      return res.status(400).json({
        message: "Invalid String fields",
        fields: invaidStringFields,
      });

    if (typeof OTP !== "string")
      return res.status(400).json({ message: "OTP should  be a  string" });

    const regex = /^\d{6}$/;
    if (!regex.test(OTP))
      return res
        .status(400)
        .json({ message: "Invalid OTP Format, it should contain 6 digits" });

    const modifiedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: { email: modifiedEmail },
      attributes: ["id", "email_verified"],
    });

    if (!user) return res.status(400).json({ message: "email is invalid" });

    if (user.email_verified)
      return res
        .status(409)
        .json({ message: "Email already verified. Please login" });

    const otpHash = hashOTP(OTP);

    const emailVerification = await EmailVerification.findOne({
      where: { userId: user.id },
    });

    if (!emailVerification)
      return res
        .status(400)
        .json({ message: "Please request an OTP to verify email" });

    const otpExpiration = new Date(emailVerification.expires_at);
    const now = new Date();

    if (now >= otpExpiration) {
      await emailVerification.destroy();
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (emailVerification.attempts === 5)
      return res
        .status(400)
        .json({
          message:
            "Maximum number of OTP attempts reached.Please request another",
        });

    if (
      otpHash !== emailVerification.otpHash &&
      emailVerification.attempts < 5
    ) {
      let nextAttemptCount = emailVerification.attempts + 1;
      await emailVerification.update({
        attempts: nextAttemptCount,
      });
      if (emailVerification.attempts === 5)
        return res
          .status(400)
          .json({ message: "Maximum number attempts reached" });
      return res.status(400).json({ message: "Incorect OTP" });
    }

    await user.update({ email_verified: true });
    await emailVerification.destroy();

    return res.status(200).json({ message: "Successfully verifiied OTP" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to veriify OTP" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const fields = {
      email,
    };

    const invalidRequiredFields = checkRequiredFields(fields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    const invaidStringFields = checkStringFields(fields);

    if (invaidStringFields.length > 0)
      return res.status(400).json({
        message: "Invalid String fields",
        fields: invaidStringFields,
      });

    const modifiedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: { email: modifiedEmail },
      attributes: ["id", "email_verified"],
    });

    if (!user) return res.status(400).json({ message: "email is invalid" });

    if (user.email_verified)
      return res
        .status(409)
        .json({ message: "Email already verified. Please login" });

    const now = new Date();

    let otpRateLimit = await OtpRateLimit.findOne({
      where: { userId: user.id },
    });

    const otpRateLimitExpiration = otpRateLimit
      ? new Date(otpRateLimit.resetTime)
      : null;

    if (
      otpRateLimit &&
      otpRateLimit.resendTries === 5 &&
      otpRateLimitExpiration > now
    ) {
      const remainigSeconds = otpRateLimitExpiration
        ? Math.max(
            0,
            Math.ceil((otpRateLimitExpiration.getTime() - Date.now()) / 1000),
          )
        : 0;
      return res.status(400).json({
        message: `Maximum number of resend attempts reached.Please try again after ${remainigSeconds}s`,
      });
    }

    if (otpRateLimit && now >= otpRateLimit.resetTime) {
      const expires_at = new Date(Date.now() + 15 * 60 * 1000);
      await otpRateLimit.update({
        resendTries: 0,
        resetTime: expires_at,
      });
    }

    if (!otpRateLimit) {
      const expires_at = new Date(Date.now() + 15 * 60 * 1000);
      otpRateLimit = await OtpRateLimit.create({
        resendTries: 1,
        resetTime: expires_at,
        userId: user.id,
      });
    } else {
      let resendTriesAttempt = otpRateLimit.resendTries;
      await otpRateLimit.update({
        resendTries: resendTriesAttempt + 1,
      });
    }

    try {
      await issueEmailVerification(user.id, modifiedEmail);
      return res.status(200).json({ message: "Successfully sent the OTP" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to send the OTP",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to request for another OTP" });
  }
};
