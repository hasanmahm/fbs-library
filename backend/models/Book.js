import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, default: "Unknown" },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  type: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Book", bookSchema);
