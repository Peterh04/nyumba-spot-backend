import crypto from "crypto";

export default function generateOTP() {
  const code = crypto.randomInt(0, 1000000);
  const codeWithZeros = String(code).padStart(6, "0");

  return codeWithZeros;
}
