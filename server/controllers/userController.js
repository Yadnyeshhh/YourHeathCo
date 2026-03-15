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

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const query = req.query.query || "";
    const gender = req.query.gender || "";
    const bloodGroup = req.query.bloodGroup || "";
    const minAge = parseInt(req.query.minAge) || 0;
    const maxAge = parseInt(req.query.maxAge) || 120;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // ✅ Base filter: users who are not assigned to any admin
    const filter = {
      $and: [
        {
          $or: [
            { admin: { $exists: false } },
            { admin: null }
          ]
        },
        { age: { $gte: minAge, $lte: maxAge } }
      ]
    };

    // ✅ Search fields dynamically
    if (query) {
      filter.$and.push({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } }
        ]
      });
    }

    if (gender) filter.$and.push({ gender });
    if (bloodGroup) filter.$and.push({ bloodGroup });

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .select("-password -__v");

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({ users, totalPages });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Server error while searching users" });
  }
};

// @desc    Assign a user to an admin
// @route   PATCH /api/users/assign/:id
// @access  Private (Admin)
const assignUserToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { admin: adminId },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Unassign a user (remove admin)
// @route   PATCH /api/users/unassign/:id
// @access  Private (Admin)
const unassignUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { admin: null },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getProfile,
  updateUser,
  getAllUsers,
  searchUsers,
  assignUserToAdmin,
  unassignUser,
};
