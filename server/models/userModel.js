const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

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
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

// -------------------- Static: Signup --------------------
userSchema.statics.signup = async function (name, age, gender, contact, bloodGroup, email, password, admin) {
  if (!name || !email || !password) {
    throw Error("All required fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email format");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    age,
    gender,
    contact,
    bloodGroup,
    email,
    password: hash,
    admin,
  });

  return user;
};

// -------------------- Static: Login --------------------
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

