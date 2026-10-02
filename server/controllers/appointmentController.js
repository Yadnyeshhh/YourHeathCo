const Appointment = require('../models/Appointment');

// GET /api/appointments/:patientId
exports.getAppointments = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const appointments = await Appointment.find({
      patientId,
      date: { $gte: startOfToday }
    }).sort({ date: 1 });
    res.json({ success: true, data: appointments });
  } catch (err) { next(err); }
};

// DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Authorization: only the appointment owner (patient) or admin can delete
    const isOwner = req.user && req.user._id.toString() === appointment.patientId.toString();
    const isAdmin = req.admin && req.admin._id.toString() === req.auth.id;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
    }

    await Appointment.findByIdAndDelete(id);
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/appointments/:patientId
exports.updateAppointment = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { title, doctorName, doctorRole, location, mode, notes, date, time } = req.body;
    
    // Find existing appointment for this patient or create new
    let appointment = await Appointment.findOne({ patientId });
    if (!appointment) {
      appointment = new Appointment({ patientId });
    }
    
    if (title !== undefined) appointment.title = title;
    if (doctorName !== undefined) appointment.doctorName = doctorName;
    if (doctorRole !== undefined) appointment.doctorRole = doctorRole;
    if (location !== undefined) appointment.location = location;
    if (mode !== undefined) appointment.mode = mode;
    if (notes !== undefined) appointment.notes = notes;
    if (date) appointment.date = new Date(date);
    if (time !== undefined) appointment.time = time;

    await appointment.save();
    res.status(200).json({ success: true, data: appointment });
  } catch (err) { next(err); }
};

// POST /api/appointments/request
exports.requestAppointment = async (req, res, next) => {
  try {
    const patientId = req.user._id;
    const { title, date, time, notes, mode, adminId } = req.body;
    
    const appointment = new Appointment({
      patientId,
      title,
      date: new Date(date),
      time,
      notes,
      mode,
      status: 'Pending'
    });
    
    await appointment.save();

    // Create a notification for the Admin
    // If adminId is not provided, we can fetch the user's assigned admin
    const User = require('../models/userModel');
    const Notification = require('../models/Notification');
    const user = await User.findById(patientId);
    
    if (user && user.admin) {
      const notification = new Notification({
        recipient: user.admin,
        recipientModel: 'Admin',
        sender: patientId,
        senderModel: 'User',
        type: 'APPOINTMENT_REQUEST',
        message: `New appointment request from ${user.name} on ${date} at ${time}.`,
        relatedId: appointment._id
      });
      await notification.save();
    }

    res.status(201).json({ success: true, data: appointment, message: 'Appointment requested successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/admin/pending
exports.getPendingAppointments = async (req, res, next) => {
  try {
    // Assuming admin is logged in
    // To filter appointments assigned to this admin's patients
    const User = require('../models/userModel');
    const patients = await User.find({ admin: req.admin._id }).select('_id');
    const patientIds = patients.map(p => p._id);

    const appointments = await Appointment.find({
      patientId: { $in: patientIds },
      status: 'Pending'
    }).populate('patientId', 'name email');
    
    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

// PUT /api/appointments/:id/status
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Accepted' or 'Rejected'

    const appointment = await Appointment.findById(id).populate('patientId', 'name admin');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Authorization: only the appointment owner (patient) or admin can update status
    const isOwner = req.user && req.user._id.toString() === appointment.patientId._id.toString();
    const isAdmin = req.admin && req.admin._id.toString() === req.auth.id;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
    }

    appointment.status = status;
    await appointment.save();

    // Notify the user (patient)
    const Notification = require('../models/Notification');
    const senderId = req.admin ? req.admin._id : req.user._id;
    const senderModel = req.admin ? 'Admin' : 'User';
    const notification = new Notification({
      recipient: appointment.patientId._id,
      recipientModel: 'User',
      sender: senderId,
      senderModel: senderModel,
      type: `APPOINTMENT_${status.toUpperCase()}`,
      message: `Your appointment request for ${appointment.date.toISOString().split('T')[0]} at ${appointment.time} has been ${status.toLowerCase()}.`,
      relatedId: appointment._id
    });
    await notification.save();

    res.json({ success: true, data: appointment, message: `Appointment ${status.toLowerCase()} successfully` });
  } catch (err) {
    next(err);
  }
};
