import cron from "node-cron";
import Borrower from "../models/Borrower.js";
import { sendMail } from "./mailer.js";

// Run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Checking for return reminders...");
  const today = new Date().toISOString().split("T")[0];

  const borrowers = await Borrower.find().populate("bookId");

  for (const b of borrowers) {
    const due = new Date(b.returnDate).toISOString().split("T")[0];
    if (today === due) {
      await sendMail(
        b.email,
        "📅 FBS Library - Return Reminder",
        `<p>Dear ${b.name},</p>
         <p>This is a friendly reminder <strong>to return</strong> <b>${b.bookId.name}</b> today.</p>
         <p>– FBS Library Team</p>`
      );
      console.log(`📧 Reminder email sent to ${b.email}`);
    }
  }
});
