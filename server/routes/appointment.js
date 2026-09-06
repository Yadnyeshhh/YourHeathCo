const express = require('express');
const router = express.Router();
const { getAppointments, updateAppointment } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const { checkOwnership } = require('../utils/ownership');
const validate = require('../middleware/validate');
const { appointmentValidator } = require('../validators/appointmentValidator');

// GET appointments for a patient (patient or admin)
router.get('/:patientId', auth, checkOwnership('patientId'), getAppointments);

// PUT (create/update) appointment for a patient (admin only via ownership check)
router.put('/:patientId', auth, checkOwnership('patientId'), validate(appointmentValidator), updateAppointment);

module.exports = router;
