import crypto from "crypto";

export default function hashOTP(OTP) {
  const hash = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(OTP)
    .digest("hex");

  return hash;
}
