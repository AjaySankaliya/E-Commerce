const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOtpEmail = (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Password Reset OTP",

    html: `Your OTP code is: <b> ${otp} </b>. It will expire in 10 minutes.`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.log("Email have not send", error);
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};

module.exports = sendOtpEmail;
