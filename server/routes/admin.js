const express = require('express');
const router = express.Router();
const {loginAdmin , signupAdmin} = require('../controller/adminController')
const authmiddleware = require('../middleware/auth')

//get profile 
// router.get("/profile" ,authmiddleware ,getProfile)

//login route
router.post("/login" ,loginAdmin)

//signup route
router.post("/signin" ,signupAdmin)

module.exports = router;