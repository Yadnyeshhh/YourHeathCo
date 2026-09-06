const userService = require("../services/userService");
const medsService = require("../services/medsService");
const PatientStatus = require("../models/PatientStatus");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");
const AppError = require("../utils/appError");

// 🧍‍♂️ Get patient (user) profile
const getProfile = catchAsync(async (req, res) => {
  const profile = await User.findById(req.user._id).lean();
  const patientStatus = await PatientStatus.findOne({ patient: req.user._id }).lean();
  
  const data = {
    ...profile,
    patientStatus: patientStatus || null
  };

  res.status(200).json(new ApiResponse(200, data, "Profile fetched successfully"));
});
//  Login user (patient)s
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  
  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

//  Signup user
const signupUser = catchAsync(async (req, res) => {
  const adminId = req.admin ? req.admin._id : null;
  const result = await userService.signup(req.body, adminId);
  
  res.status(201).json(new ApiResponse(201, result, "Signup successful"));
});

//  Update user info
const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const updatedUser = await userService.updateUser(userId, req.body);
  
  res.status(200).json(new ApiResponse(200, { user: updatedUser }, "User updated successfully"));
});

// Search users
const searchUsers = catchAsync(async (req, res) => {
  const { query, gender, bloodGroup, minAge, maxAge, page } = req.query;
  const limit = 10;
  
  const result = await userService.searchUsers(
    query || "", 
    { gender, bloodGroup, minAge: parseInt(minAge), maxAge: parseInt(maxAge) },
    { page: parseInt(page) || 1, limit }
  );

  res.status(200).json(new ApiResponse(200, result, "Users fetched successfully"));
});

// 🖼️ Upload user profile image
const uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "No image file provided"));
  }

  const updatedUser = await userService.uploadProfileImage(req.user._id, req.file.path);
  res.status(200).json(new ApiResponse(200, { user: updatedUser }, "Profile image updated successfully"));
});

// Admin assigning actions. (Can also live in admin controller, but kept here since it uses User model mostly)
const assignUserToAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const adminId = req.body.adminId || req.auth?.id;
  if (!adminId) {
    throw new AppError('Admin ID missing for assignment', 400);
  }
  const updatedUser = await userService.updateUser(id, { admin: adminId });
  
  res.status(200).json(new ApiResponse(200, { user: updatedUser }, "User assigned successfully"));
});

const unassignUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.updateUser(id, { admin: null });
  // Empty all meds and meal fields for this patient
  await medsService.resetSchedule(id);
  
  res.status(200).json(new ApiResponse(200, { user: updatedUser }, "User unassigned and schedule cleared successfully"));
});

// Used internally by other controllers, keep it or move it
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).json(new ApiResponse(200, { users }, "All users fetched"));
});


module.exports = {
  loginUser,
  signupUser,
  getProfile,
  updateUser,
  getAllUsers,
  searchUsers,
  assignUserToAdmin,
  unassignUser,
  uploadProfileImage,
};
