const mongoose = require('mongoose');

const patientStatusSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  admitted: { type: Boolean, default: false },
  statusFlag: { type: String, enum: ['Stable', 'Monitor', 'Review'], default: 'Stable' },
  admissionTime: { type: Date },
  dischargeTime: { type: Date },
  roomNumber: { type: String, default: '' },
  diagnosis: { type: String, default: '' },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null,
  },
  consultingDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  }],
  nextAppointment: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientStatus', patientStatusSchema);
