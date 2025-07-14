const express = require('express');
const router = express.Router();
const {

  updateMeds,
  getAllMedsAndMeals,
  createEmptyPatientSchedule
} = require('../controller/meds_meal');

router.post('/create/:id', createEmptyPatientSchedule);

router.patch('/patient/:id/medications', updateMeds);

router.get('/patient/:id/schedule',async (req, res) => {
  try {
    const schedule = await getAllMedsAndMeals(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(schedule); 
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
