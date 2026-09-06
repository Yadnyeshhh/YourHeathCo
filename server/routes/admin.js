const express = require("express");
const router = express.Router();
const { loginAdmin, signupAdmin, getProfile, getAllUsers, resetPatientSchedule } = require("../controllers/adminController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const { adminSignupSchema, adminLoginSchema } = require("../validators/adminValidator");

// Public Routes
router.post("/signup", validate(adminSignupSchema), signupAdmin);
router.post("/login", validate(adminLoginSchema), loginAdmin);

// Protected Routes
router.get("/profile", auth, requireRole('admin'), getProfile);
router.get("/users", auth, requireRole('admin'), getAllUsers);
router.post("/users/:id/reset-schedule", auth, requireRole('admin'), resetPatientSchedule);

module.exports = router;
