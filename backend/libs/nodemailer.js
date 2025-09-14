import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "antanu.bittu@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendMail = async (to, html) => {
  try {
    const info = await transport.sendMail({
      sender: "antanu.bittu@gmail.com",
      to,
      subject: "Verify your email",
      html,
    });
    return info;
  } catch (error) {
    console.error("error sending email using nodemailer", error);
  }
};

export const sendPasswordChangingMail = async (to, html) => {
  try {
    const info = await transport.sendMail({
      sender: "antanu.bittu@gmail.com",
      to,
      subject: "Change your password",
      html,
    });
    return info;
  } catch (error) {
    console.error("error sending email using nodemailer", error);
  }
};
