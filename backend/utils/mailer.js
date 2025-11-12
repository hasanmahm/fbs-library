import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.log("❌ Mailer verify failed:", error);
  else console.log("✅ Mailer ready to send emails");
});

export async function sendMail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"FBS Library 📚" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
}
