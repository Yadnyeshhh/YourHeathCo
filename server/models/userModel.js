const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// -------------------- Schema --------------------
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: Number,
  gender: String,
  contact: String,
  bloodGroup: String,
  profileImage: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password by default
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
