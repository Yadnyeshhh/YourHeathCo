const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { updateMedsSchema } = require('../validators/medsValidator');
const { updateMeds, getAllMedsAndMeals, createEmptyPatientSchedule } = require('../controllers/meds_meal');

// Create empty schedule
router.post('/create/:id', auth, createEmptyPatientSchedule);

// Update medications & meals
router.patch('/patient/:id/medications', auth, validate(updateMedsSchema), updateMeds);
router.get('/patient/:id/schedule', auth, getAllMedsAndMeals);

module.exports = router;
