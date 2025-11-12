import { sendMail } from "./utils/mailer.js";

(async () => {
  console.log("🚀 Sending test email...");
  await sendMail(
    "your-email@gmail.com", // 👈 use your real email here
    "Test Email from FBS Library",
    "<h2>Hello from FBS Library!</h2><p>If you see this, nodemailer works ✅</p>"
  );
})();
