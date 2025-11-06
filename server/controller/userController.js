const User = require("../models/userModel");
const PatientStatus = require("../models/PatientStatus");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getAllUsers } = require("./adminController");

// Helper: Create a JWT for users
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// 🧍‍♂️ Get patient (user) profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const status = await PatientStatus.findOne({ patient: req.user._id });

    res.status(200).json({
      ...user.toObject(),
      patientStatus: status || null, // include linked status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


// 🔐 Login user (patient)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🆕 Signup user (patient self-registration — optional)
const signupUser = async (req, res) => {
  const { name, age, gender, contact, bloodGroup, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Note: if this route is used by admin, req.admin._id will exist
    const adminId = req.admin ? req.admin._id : null;

    const user = await User.create({
      name,
      age,
      gender,
      contact,
      bloodGroup,
      email,
      password: hash,
      admin: adminId, // assign admin if available
    });

    const token = createToken(user._id);
    res.status(201).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✏️ Update user info (patients can update their profile)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    delete updates.password;
    delete updates.email;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password -__v -admin");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

module.exports = { loginUser, signupUser, getProfile, updateUser ,getAllUsers};
