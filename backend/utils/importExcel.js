import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import XLSX from "xlsx";
import Book from "../models/Book.js";
import connectDB from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  await connectDB();
  try {
    const workbook = XLSX.readFile(
      path.join(__dirname, "../FBS book register.xlsx")
    );
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    console.log(`Found ${rows.length} rows. Importing...`);
    for (const r of rows) {
      // adapt keys to your excel columns. common names tried:
      const name =
        r["Name of books"] || r["Book Name"] || r["name"] || r["Name"];
      if (!name) continue;

      const author = r["Author name"] || r["Author"] || r["author"] || "";
      const price = parseFloat(r["Price"] || r["price"] || 0) || 0;
      const quantity = parseInt(r["Quantity"] || r["quantity"] || 1) || 1;
      const type = r["Types"] || r["Type"] || "General";

      // Upsert by name+author to avoid duplicates
      await Book.findOneAndUpdate(
        { name: name.trim(), author: author.trim() },
        { name: name.trim(), author: author.trim(), price, quantity, type },
        { upsert: true, new: true }
      );
    }
    console.log("✅ Books imported/updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Import error:", err);
    process.exit(1);
  }
};

run();
