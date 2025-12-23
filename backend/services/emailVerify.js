const nodemailer = require("nodemailer");
require("dotenv").config();

const verifyEmail = (token, email) => {
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

    subject: "Email Verification",

    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5173/verify/${token} 
           Thanks`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.log("Email have not send", error);
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};

module.exports = verifyEmail;
