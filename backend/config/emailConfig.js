const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  (process.env.CLIENT_ID || "").trim(),
  (process.env.CLIENT_SECRET || "").trim(),
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: (process.env.REFRESH_TOKEN || "").trim(),
});

const createTransporter = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: (process.env.EMAIL_USER || "").trim(),
        clientId: (process.env.CLIENT_ID || "").trim(),
        clientSecret: (process.env.CLIENT_SECRET || "").trim(),
        refreshToken: (process.env.REFRESH_TOKEN || "").trim(),
        accessToken: accessToken.token,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

module.exports = createTransporter;
