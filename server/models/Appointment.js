const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  doctorName: { type: String, default: '' },
  doctorRole: { type: String, default: '' },
  location: { type: String, default: '' },
  mode: { type: String, enum: ['In-person', 'Telehealth'], default: 'In-person' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
