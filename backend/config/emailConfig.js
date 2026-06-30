const { Resend } = require("resend");
require("dotenv").config();

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const sendEmail = async ({ to, subject, html, text }) => {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = "E-Commerce <onboarding@resend.dev>";
  const recipients = Array.isArray(to) ? to : [to];

  const response = await resend.emails.send({
    from,
    to: recipients,
    subject,
    html,
    text,
  });

  if (response.error) {
    throw new Error(response.error.message || "Resend email failed");
  }

  return response;
};

module.exports = sendEmail;
