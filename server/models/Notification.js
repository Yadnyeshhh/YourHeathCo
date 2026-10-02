const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true }, // User or Admin ID
  recipientModel: { type: String, required: true, enum: ['User', 'Admin'] },
  sender: { type: mongoose.Schema.Types.ObjectId }, // User or Admin ID
  senderModel: { type: String, enum: ['User', 'Admin'] },
  type: { type: String, required: true }, // 'APPOINTMENT_REQUEST', 'APPOINTMENT_ACCEPTED', 'APPOINTMENT_REJECTED'
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Appointment ID
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
