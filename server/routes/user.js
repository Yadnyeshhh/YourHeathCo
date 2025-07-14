const express = require('express');
const router = express.Router();
const {loginUser , signupUser , getProfile , getAllUsers} = require('../controller/userController')
const authmiddleware = require('../middleware/auth')

//get profile 
router.get("/profile" ,authmiddleware ,getProfile)

//login route
router.post("/login" ,loginUser)

//signup route
router.post("/signup" ,signupUser)

//all
router.get('/all' , getAllUsers)

module.exports = router;