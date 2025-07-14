const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contact: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/ // You can customize the pattern as needed
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});




userSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw Error("enter both email and password");
  }
  if (!validator.isEmail(email)) {
    throw Error("Enter valid email address");
  }
  // if (!validator.isStrongPassword(password)) {
  //   throw Error("enter a strong password");
  // }

  const exist = await this.findOne({ email });
  if (exist) {
    throw Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

//statics login
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("enter both email and password");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("email does not exist");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);