const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel"); // adjust path if needed

dotenv.config();

const ADMIN_ID = "687530e5a20234605ca081fd"; // replace with your admin’s _id

async function assignAdminToAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await User.updateMany(
      { admin: { $exists: false } }, // only update users that don’t already have admin field
      { $set: { admin: ADMIN_ID } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating users:", error);
    process.exit(1);
  }
}

assignAdminToAllUsers();

