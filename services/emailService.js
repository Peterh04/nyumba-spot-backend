import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: "NyumbaSpot <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email sending failed: ", error);
    throw new Error("Failed to send email.");
  }

  return data;
}
