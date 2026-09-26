const Appointment = require('../models/Appointment');

// GET /api/appointments/:patientId
exports.getAppointments = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId });
    res.json({ success: true, data: appointments });
  } catch (err) { next(err); }
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
