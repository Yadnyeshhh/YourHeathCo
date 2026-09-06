// server/config/db.js – connection helper with graceful fallback for test environment
const mongoose = require("mongoose");

const connectDB = async () => {
  // Skip connection when MONGO_URI is not set (e.g., during Jest tests)
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set – skipping MongoDB connection (test mode?)");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
