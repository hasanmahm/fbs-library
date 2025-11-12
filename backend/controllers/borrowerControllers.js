import Borrower from "../models/Borrower.js";
import Book from "../models/Book.js";
import { sendMail } from "../utils/mailer.js";

// 📖 Get all borrowers
export const getBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find()
      .populate("bookId")
      .sort({ borrowDate: -1 });
    res.json(borrowers);
  } catch (err) {
    console.error("❌ Error fetching borrowers:", err);
    res.status(500).json({ error: "Failed to fetch borrowers" });
  }
};

// ➕ Add new borrower and send email
export const addBorrower = async (req, res) => {
  try {
    const { name, email, phone, designation, bookId, returnDate } = req.body;
    console.log("📥 New borrower request:", name, email, bookId);

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.quantity <= 0)
      return res.status(400).json({ error: "No copies available" });

    const borrower = await Borrower.create({
      name,
      email,
      phone,
      designation,
      bookId,
      borrowDate: new Date(),
      returnDate,
    });

    book.quantity -= 1;
    await book.save();

    const formattedReturn = new Date(returnDate).toLocaleDateString();
    const html = `
      <h2>📚 FBS Library Borrow Confirmation</h2>
      <p>Dear ${name},</p>
      <p>You have borrowed the book <strong>${book.name}</strong>.</p>
      <p><b>Borrow Date:</b> ${new Date().toLocaleDateString()}</p>
      <p><b>Return Date:</b> ${formattedReturn}</p>
      <p>Please return it on time.</p>
      <br>
      <p>Thank you</p>
      <p><strong>– FBS Library Team</strong></p>
    `;

    await sendMail(email, "FBS Library – Borrow Confirmation", html);
    console.log(`✅ Borrower added & email sent to ${email}`);

    res.status(201).json(await borrower.populate("bookId"));
  } catch (err) {
    console.error("❌ Error adding borrower:", err);
    res.status(500).json({ error: "Failed to add borrower" });
  }
};

// ❌ Delete borrower & increase book stock
export const deleteBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id);
    if (!borrower) return res.status(404).json({ error: "Not found" });

    const book = await Book.findById(borrower.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }
    await Borrower.findByIdAndDelete(req.params.id);
    res.json({ message: "Borrower deleted and book returned" });
  } catch (err) {
    console.error("❌ Error deleting borrower:", err);
    res.status(500).json({ error: "Failed to delete borrower" });
  }
};
