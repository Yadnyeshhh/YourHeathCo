const express = require("express");
const router = express.Router();
const { updatePatientStatus } = require("../controllers/PatientStatusController");
const requireAdminAuth = require("../middleware/auth.js");

router.put("/:userId", requireAdminAuth, updatePatientStatus);

module.exports = router;
