const adminService = require("../services/adminService");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/apiResponse");

const signupAdmin = catchAsync(async (req, res) => {
  const result = await adminService.signup(req.body);
  res.status(201).json(new ApiResponse(201, result, "Admin registered successfully"));
});

const loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await adminService.login(email, password);
  res.status(200).json(new ApiResponse(200, result, "Admin logged in successfully"));
});

const getAllUsers = catchAsync(async (req, res) => {
  const adminId = req.auth?.id;
  const query = req.query.query || "";
  
  const users = await adminService.getAllAssignedUsers(adminId, query);
  res.set('Cache-Control', 'no-store');
  res.status(200).json(new ApiResponse(200, { users }, "Assigned users fetched"));
});

const getProfile = catchAsync(async (req, res) => {
  const admin = await adminService.getAdminProfile(req.admin._id);
  res.status(200).json(new ApiResponse(200, { admin }, "Admin profile fetched"));
});

// Reset a patient's schedule (meds and meals) to empty defaults
const resetPatientSchedule = catchAsync(async (req, res) => {
  const { id } = req.params; // patient id
  const updated = await adminService.resetPatientSchedule(id);
  res.status(200).json(new ApiResponse(200, updated, "Patient schedule reset"));
});

module.exports = {
  loginAdmin,
  signupAdmin,
  getAllUsers,
  getProfile,
  resetPatientSchedule,
};
