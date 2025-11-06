const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const PatientStatus = require('../models/PatientStatus')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 📍 PUT /api/admin/patient-status/:userId
const updatePatientStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body; // { admitted, dischargeTime, roomNumber, etc. }

    // Check if status exists
    let status = await PatientStatus.findOne({ patient: userId });

    if (!status) {
      // create new if missing
      status = new PatientStatus({ patient: userId, ...updates });
    } else {
      // update existing
      Object.assign(status, updates);
    }

    await status.save();

    res.status(200).json({
      message: "Patient status updated successfully",
      status,
    });
  } catch (err) {
    console.error("Error updating patient status:", err);
    res.status(500).json({ error: "Failed to update patient status" });
  }
};
module.exports = {updatePatientStatus};