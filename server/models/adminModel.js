const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
  instituteName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
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
});

// statics.signup
adminSchema.statics.signup = async function (instituteName, address, email, password) {
  if (!instituteName || !address || !email || !password) {
    throw Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw Error("Enter a valid email address");
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const admin = await this.create({ instituteName, address, email, password: hash });
  return admin;
};

// statics.login
adminSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Enter both email and password");
  }

  const admin = await this.findOne({ email });
  if (!admin) {
    throw Error("Email does not exist");
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return admin;
};
module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
