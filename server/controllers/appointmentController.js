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
    const { date, time, notes } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { patientId, date },
      { patientId, date, time, notes },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, data: appointment });
  } catch (err) { next(err); }
};
