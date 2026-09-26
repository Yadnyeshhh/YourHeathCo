const express = require('express');
const router = express.Router();
const { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllDoctors);
router.get('/:id', auth, getDoctorById);
router.post('/', auth, createDoctor);
router.put('/:id', auth, updateDoctor);
router.delete('/:id', auth, deleteDoctor);

module.exports = router;
