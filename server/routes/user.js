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
  uploadProfileImage,
} = require("../controllers/userController");

// ✅ Import middleware
const authMiddleware = require("../middleware/auth");
const auth = require("../middleware/requireAdminAuth");

// ✅ Multer config for Profile Image
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/profile";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id.toString() + "-" + Date.now() + ext);
  }
});
const upload = multer({ storage });

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

// Upload profile image (Authenticated)
router.patch("/upload-profile", authMiddleware, upload.single("profileImage"), uploadProfileImage);

// -------------------- Admin Actions --------------------

// Search for users without admin
router.get("/search", auth, searchUsers);

// Assign user to admin
router.patch("/assign/:id", auth, assignUserToAdmin);

// Unassign user from admin
router.patch("/unassign/:id", auth, unassignUser);

module.exports = router;
