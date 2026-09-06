const express = require('express');
const router = express.Router();
const { updatePatientStatus } = require('../controllers/PatientStatusController');
const auth = require('../middleware/auth');
const { checkOwnership } = require('../utils/ownership');

// Allow admin or the patient (owner) to update status
router.put('/:userId', auth, checkOwnership('userId'), updatePatientStatus);

module.exports = router;

