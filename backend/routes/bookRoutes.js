import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ name: 1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single book
router.get("/:id", async (req, res) => {
  try {
    const b = await Book.findById(req.params.id);
    if (!b) return res.status(404).json({ error: "Book not found" });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add book
router.post("/", async (req, res) => {
  try {
    const { name, author, price, quantity, type } = req.body;
    const book = new Book({ name, author, price, quantity, type });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update book
router.put("/:id", async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
