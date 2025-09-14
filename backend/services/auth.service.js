import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mjml2html from "mjml";
import { sendMail, sendPasswordChangingMail } from "../libs/nodemailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendVerificationMail = async (email, otp) => {
  try {
    let template = await fs.readFile(
      path.join(__dirname, "../templates/verificationEmail.mjml"),
      "utf-8"
    );
    template = template.replace("{{OTP}}", otp);
    const { html } = mjml2html(template);
    const data = await sendMail(email, html);
    return data;
  } catch (error) {
    console.error("error while sending verification mail", error);
  }
};

export const sendMailForPasswordChange = async (email, name, otp) => {
  try {
    let template = await fs.readFile(
      path.join(__dirname, "../templates/changePassword.mjml"),
      "utf-8"
    );
    template = template
      .replace("{{OTP}}", otp)
      .replace("{{name}}", name)
      .replace("{{email}}", email);
    const { html } = mjml2html(template);
    const data = await sendPasswordChangingMail(email, html);
    return data;
  } catch (error) {
    console.error("error while sending verification mail", error);
  }
};
