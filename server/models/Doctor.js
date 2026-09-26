const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  tag: { type: String, enum: ['Primary', 'Referral', 'Monitoring'], default: 'Primary' },
  img: { type: String, default: '' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
