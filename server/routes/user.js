const express = require('express');
const router = express.Router();
const { loginUser, signupUser, getProfile, getAllUsers, updateUser } = require('../controller/userController');
const authmiddleware = require('../middleware/auth');

// Get profile
router.get("/profile", authmiddleware, getProfile);

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

// Get all users
router.get("/all", getAllUsers);

// Update user (authenticated)
router.put("/update/:id", authmiddleware, updateUser);

module.exports = router;
