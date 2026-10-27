import EmailVerification from "../models/EmailVerification.js";
import generateOTP from "../utils/generateOtp.js";
import hashOTP from "../utils/hashOTP.js";
import sendVerificationEmail from "./verificationEmailService.js";

export default async function issueEmailVerification(userId, email) {
  const OTP = generateOTP();
  const otpHash = hashOTP(OTP);
  const expires_at = new Date(Date.now() + 5 * 60 * 1000);

  const [verification, created] = await EmailVerification.findOrCreate({
    where: { userId },
    defaults: {
      otpHash,
      expires_at,
      attempts: 0,
    },
  });

  if (!created) {
    await verification.update({
      otpHash,
      expires_at,
      attempts: 0,
    });
  }

  await sendVerificationEmail(email, OTP);
}
