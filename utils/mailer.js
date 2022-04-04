import { google } from "googleapis";
import nodemailer from "nodemailer";

export function googleOAuth() {
  const oAuth2 = new google.auth.OAuth2(
    process.env.G_ID,
    process.env.G_SECRET,
    process.env.REDIRECT_TO
  );
  oAuth2.setCredentials({ refresh_token: process.env.R_TOKEN });
  return oAuth2;
}

export function getTransporter(acessToken) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.APP_EMAIL,
      clientId: process.env.G_ID,
      clientSecret: process.env.G_SECRET,
      refreshToken: process.env.R_TOKEN,
      accessToken: acessToken,
    },
  });
}

export async function sendEmail(
  { subject, text, html, email, replyTo },
  callback
) {
  const transporter = getTransporter(await googleOAuth().getAccessToken());

  const options = {
    from: "Animesports App <animesports.dev@gmail.com>",
    to: email,
    subject,
    text,
    html,
  };

  if (replyTo) options.replyTo = replyTo;

  return transporter.sendMail(options, callback);
}
