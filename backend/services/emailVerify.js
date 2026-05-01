const nodemailer = require("nodemailer");
const dns = require("dns");
require("dotenv").config();

// Force IPv4 resolution. Node 18+ defaults to IPv6 which causes timeouts on Render
dns.setDefaultResultOrder("ipv4first");

const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 600;">Welcome to Our Store!</h2>
        </div>
        <div style="color: #4a4a4a; line-height: 1.6; font-size: 16px;">
          <p style="margin-bottom: 20px;">Hi there,</p>
          <p style="margin-bottom: 30px;">Thank you for registering. We're excited to have you on board. Please confirm your email address to activate your account and start shopping.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://e-commerce-hazel-phi.vercel.app/verify/${token}" style="background-color: #000000; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">Verify Email Address</a>
          </div>
          <p style="margin-bottom: 10px; font-size: 14px; color: #666666;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; margin-bottom: 30px;"><a href="https://e-commerce-hazel-phi.vercel.app/verify/${token}" style="color: #0066cc; text-decoration: underline; font-size: 14px;">https://e-commerce-hazel-phi.vercel.app/verify/${token}</a></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px; color: #888888; text-align: center;">Thanks,<br>The E-Commerce Team</p>
        </div>
      </div>
    </div>
    `,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.log("Email have not send", error);
    } else {
      console.log("Email Sent Successfully");
      console.log(info);
    }
  });
};

module.exports = verifyEmail;
