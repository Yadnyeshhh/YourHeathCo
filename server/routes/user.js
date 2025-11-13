const express = require("express");
const router = express.Router();

// ✅ Import all user-related controllers
const {
  loginUser,
  signupUser,
  getProfile,
  getAllUsers,
  updateUser,
  searchUsers,
  assignUserToAdmin,
  unassignUser,
} = require("../controller/userController");

// ✅ Import middleware
const authMiddleware = require("../middleware/auth");
const auth = require("../middleware/requireAdminAuth")

// -------------------- Routes --------------------

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

// Get profile (Authenticated)
router.get("/profile", authMiddleware, getProfile);

// Get all users
router.get("/all", getAllUsers);

// Update user (Authenticated)
router.put("/update/:id", authMiddleware, updateUser);

// -------------------- Admin Actions --------------------

// Search for users without admin
router.get("/search", auth, searchUsers);

// Assign user to admin
router.patch("/assign/:id", auth, assignUserToAdmin);

// Unassign user from admin
router.patch("/unassign/:id", auth, unassignUser);

module.exports = router;
