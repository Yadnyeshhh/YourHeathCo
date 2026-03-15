const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const PatientStatus = require('../models/PatientStatus')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper: Create JWT for admin
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// 👤 GET /api/admin/profile
const getProfile = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId).select("-password -__v");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 POST /api/admin/login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id);

    // ✅ include profile info in response
    res.status(200).json({
      _id:admin._id,
      email: admin.email,
      instituteName: admin.instituteName,
      address: admin.address,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 🆕 POST /api/admin/signup
const signupAdmin = async (req, res) => {
  const { instituteName, address, email, password } = req.body;

  try {
    const admin = await Admin.signup(instituteName, address, email, password);
    const token = createToken(admin._id);
    res.status(200).json({ instituteName, address, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 📋 GET /api/admin/users → get all patients of this admin
const getAllUsers = async (req, res) => {
  try {
    const adminId = req.admin._id;

    // Fetch users (patients) under this admin
    const users = await User.find({ admin: adminId }).select("-password -__v");

    if (!users.length) {
      return res.status(404).json({ message: "No users found for this admin" });
    }

    // Attach patient status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const status = await PatientStatus.findOne({ patient: user._id });
        return {
          ...user.toObject(),
          admitted: status?.admitted || false,
          admissionTime: status?.admissionTime || null,
          dischargeTime: status?.dischargeTime || null,
          roomNumber: status?.roomNumber || "",
          diagnosis: status?.diagnosis || "",
          assignedDoctor: status?.assignedDoctor || "",
          nextAppointment: status?.nextAppointment || null,
        };
      })
    );

    res.status(200).json(usersWithStatus);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


// ➕ POST /api/admin/users → create new patient under this admin
const createUser = async (req, res) => {
  const { name, age, gender, contact, bloodGroup, email, password } = req.body;

  try {
    const adminId = req.admin._id;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      age,
      gender,
      contact,
      bloodGroup,
      email,
      password: hash,
      admin: adminId,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginAdmin,
  signupAdmin,
  getProfile,
  getAllUsers,
  createUser,
};
