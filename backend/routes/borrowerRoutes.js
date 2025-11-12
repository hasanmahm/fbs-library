import express from "express";
import {
  getBorrowers,
  addBorrower,
  deleteBorrower,
} from "../controllers/borrowerControllers.js";

const router = express.Router();

// GET all borrowers
router.get("/", getBorrowers);

// POST add borrower (and send email)
router.post("/", addBorrower);

// DELETE borrower
router.delete("/:id", deleteBorrower);

export default router;
