const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOtpEmail = (otp, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
        </div>
        <div style="color: #4a4a4a; line-height: 1.6; font-size: 16px;">
          <p style="margin-bottom: 20px;">Hi there,</p>
          <p style="margin-bottom: 25px;">We received a request to reset your password. Enter the One-Time Password (OTP) below to proceed with resetting your password:</p>
          <div style="text-align: center; margin: 35px 0;">
            <span style="background-color: #f4f4f4; border: 1px solid #eaeaea; padding: 16px 40px; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #000000; border-radius: 8px; display: inline-block;">${otp}</span>
          </div>
          <p style="margin-bottom: 20px; padding: 15px; background-color: #fff8e1; border-left: 4px solid #ffc107; border-radius: 4px; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="margin-bottom: 30px; font-size: 14px; color: #666666;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
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

module.exports = sendOtpEmail;
