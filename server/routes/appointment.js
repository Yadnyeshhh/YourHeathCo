const express = require('express');
const router = express.Router();
const { getAppointments, updateAppointment, updateAppointmentStatus, requestAppointment, getPendingAppointments, deleteAppointment } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { checkOwnership } = require('../utils/ownership');
const validate = require('../middleware/validate');
const { appointmentValidator, requestAppointmentValidator } = require('../validators/appointmentValidator');

// GET appointments for a patient (patient or admin)
router.get('/:patientId', auth, checkOwnership('patientId'), getAppointments);

// PUT (create/update) appointment for a patient (admin only via ownership check)
router.put('/:patientId', auth, checkOwnership('patientId'), validate(appointmentValidator), updateAppointment);

// POST request appointment (patient only)
router.post('/request', auth, validate(requestAppointmentValidator), requestAppointment);

// DELETE appointment (owner or admin)
router.delete('/:id', auth, deleteAppointment);

// GET pending appointments for admin
router.get('/admin/pending', auth, requireRole('admin'), getPendingAppointments);

// PUT update appointment status (owner or admin)
router.put('/:id/status', auth, updateAppointmentStatus);

module.exports = router;
