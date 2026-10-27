import sendEmail from "./emailService.js";

export default async function sendVerificationEmail(to, otp) {
  return await sendEmail({
    to,
    subject: "Verify your NyumbaSpot email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome to NyumbaSpot!</h2>
        <p>Use the verification code below to verify your email address.</p>
        <h1 style="letter-spacing: 8px;">${otp}</h1>
        <p>
          This code expires in <strong>5 minutes</strong>.
        </p>
        <p>
          If you didn't create a NyumbaSpot account, you can ignore this email.
        </p>
      </div>
    `,
  });
}
