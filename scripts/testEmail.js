import sendEmail from "../services/emailService.js";

try {
  const result = await sendEmail({
    to: "ph592387@gmail.com",
    subject: "NyumbaSpot email test",
    html: "<h2>Welcome to NyumbaSpot!</h2><p>Your email service is working.</p>",
  });

  console.log("Email accepted by resend", result);
} catch (error) {
  console.error("Test failed:", error);
}
