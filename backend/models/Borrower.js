import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  designation: {
    type: String,
    enum: ["Member", "Associate", "Worker", "Supporter"],
    default: "Member",
  },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date, required: true },
  reminderSent: { type: Boolean, default: false },
});

export default mongoose.model("Borrower", borrowerSchema);
