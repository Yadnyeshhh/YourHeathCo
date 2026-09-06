const express = require("express");
const router = express.Router();

// Controllers
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

// Middleware
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

// Validators
const { signupSchema, loginSchema, updateSchema, searchSchema } = require("../validators/userValidator");

// Multer config for profile image uploads
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
  },
});
const upload = multer({ storage });

// Public routes
router.post("/login", validate(loginSchema), loginUser);
router.post("/signup", validate(signupSchema), signupUser);
router.get("/all", getAllUsers);

// Protected patient routes
router.get("/profile", auth, requireRole('patient'), getProfile);
router.put("/update/:id", auth, requireRole('patient'), validate(updateSchema), updateUser);
router.patch("/upload-profile", auth, requireRole('patient'), upload.single("profileImage"), uploadProfileImage);

// Admin-only routes
router.get("/search", auth, searchUsers);
router.patch("/assign/:id", auth, assignUserToAdmin);
router.patch("/unassign/:id", auth, unassignUser);

module.exports = router;
