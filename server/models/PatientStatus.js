const mongoose = require("mongoose");

const patientStatusSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // ✅ now linked to User
    required: true,
    unique: true,
  },
  admitted: { type: Boolean, default: false },
  admissionTime: { type: Date },
  dischargeTime: { type: Date },
  roomNumber: { type: String, default: "" },
  diagnosis: { type: String, default: "" },
  assignedDoctor: { type: String, default: "" },
  nextAppointment: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientStatus", patientStatusSchema);
