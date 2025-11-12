import cron from "node-cron";
import Borrower from "../models/Borrower.js";
import { sendMail } from "../utils/mailer.js";
import Book from "../models/Book.js";

/**
 * Schedule:
 * - daily at 08:00 server time -> run job
 * - For borrowers whose returnDate is within 2 days, send first reminder (if not sent)
 * - For overdue borrowers (returnDate < today), send overdue notice (can send every day if desired)
 */

const startReminders = () => {
  cron.schedule(
    "0 8 * * *",
    async () => {
      console.log("Running daily reminder job...");
      try {
        const today = new Date();
        const inTwoDays = new Date();
        inTwoDays.setDate(today.getDate() + 2);

        // First reminders for upcoming due dates (within 2 days) where reminderSent=false
        const upcoming = await Borrower.find({
          returnDate: { $gte: today, $lte: inTwoDays },
          reminderSent: false,
        }).populate("bookId");

        for (const b of upcoming) {
          const subject = `Reminder: Please return "${b.bookId.name}"`;
          const text = `Dear ${
            b.name
          },\n\nThis is a friendly reminder that the book "${
            b.bookId.name
          }" is due on ${b.returnDate.toDateString()}. Please return it on time.\n\nRegards,\nFBS Library`;
          try {
            await sendMail({ to: b.email, subject, text });
            b.reminderSent = true;
            await b.save();
            console.log(`Sent reminder to ${b.email}`);
          } catch (err) {
            console.error("Send failed:", err);
          }
        }

        // Overdue notices (returnDate < today)
        const overdue = await Borrower.find({
          returnDate: { $lt: today },
        }).populate("bookId");

        for (const b of overdue) {
          const subject = `Overdue Notice: "${b.bookId.name}"`;
          const text = `Dear ${b.name},\n\nOur records show the book "${
            b.bookId.name
          }" was due on ${b.returnDate.toDateString()} and is now overdue. Please return as soon as possible to avoid penalties.\n\nRegards,\nFBS Library`;
          try {
            await sendMail({ to: b.email, subject, text });
            console.log(`Sent overdue notice to ${b.email}`);
          } catch (err) {
            console.error("Send failed:", err);
          }
        }
      } catch (err) {
        console.error("Reminder job error:", err);
      }
    },
    {
      timezone: "Asia/Dhaka",
    }
  );
};

export default startReminders;
