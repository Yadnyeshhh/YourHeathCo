const express = require("express");
const router = express.Router();
const { loginAdmin, signupAdmin, getProfile ,getAllUsers} = require("../controller/adminController");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// ------------------ Public Routes ------------------
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

// ------------------ Protected Routes ------------------
router.get("/profile", requireAdminAuth, getProfile);

// ✅ Get all users created by this admin
router.get("/users", requireAdminAuth, getAllUsers);

module.exports = router;
