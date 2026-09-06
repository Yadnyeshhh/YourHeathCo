const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth'); // <-- added auth middleware import
const { updateMedsSchema } = require('../validators/medsValidator');
const { updateMeds, getAllMedsAndMeals, createEmptyPatientSchedule } = require('../controllers/meds_meal');
// const { checkOwnership } = require('../utils/ownership'); // ownership removed

// Create empty schedule (owner must match id)
router.post('/create/:id', auth, createEmptyPatientSchedule);

// Update medications (owner must match id)
router.patch('/patient/:id/medications', auth, validate(updateMedsSchema), updateMeds);
router.get('/patient/:id/schedule', auth, getAllMedsAndMeals);

module.exports = router;
