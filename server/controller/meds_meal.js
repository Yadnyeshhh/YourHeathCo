const Patient = require('../models/meds_meal');

const updateMeds = async (req, res) => {
  const { id } = req.params; 
  const { schedule } = req.body;

  if (!schedule) return res.status(400).json({ message: "Schedule required" });

  try {
    const updateQuery = Object.entries(schedule).reduce((acc, [day, data]) => {
      if (data.medicines) {
        acc[`schedule.${day}.medicines`] = data.medicines;
      }
      if (data.meal) {
        acc[`schedule.${day}.meal`] = data.meal;
      }
      return acc;
    }, {});

    const updated = await Patient.findOneAndUpdate(
      { id: id },
      { $set: updateQuery },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Patient not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating medications and meals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createEmptyPatientSchedule = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'Patient ID is required' });
  }

  try {
    const existingPatient = await Patient.findOne({ id });

    if (existingPatient) {
      return res.status(200).json({
        message: 'Patient already exists',
        patient: existingPatient
      });
    }

    
    const defaultDay = {
      medicines: [],
      meal: {
        breakfast: null,
        lunch: null,
        dinner: null
      }
    };

    const schedule = {
      monday: defaultDay,
      tuesday: defaultDay,
      wednesday: defaultDay,
      thursday: defaultDay,
      friday: defaultDay,
      saturday: defaultDay,
      sunday: defaultDay
    };

    const newPatient = new Patient({ id, schedule });
    await newPatient.save();

    return res.status(201).json({
      message: 'Patient created',
      patient: newPatient
    });
  } catch (err) {
    console.error('Error creating patient:', err);
    return res.status(500).json({ error: 'Server error while creating patient' });
  }
};


const getAllMedsAndMeals = async (patientId) => {
  try {
const patient = await Patient.findOne({ id: patientId }).lean();

    if (!patient) {
      console.log("Patient not found");
      return null;
    }

    const schedule = patient.schedule;
    const result = {};

    for (const day of Object.keys(schedule)) {
      const dayData = schedule[day];
      result[day] = {
        medicines: dayData?.medicines || [],
        meal: dayData?.meal || {}
      };
    }

    return result; 
  } catch (err) {
    console.error("Error fetching patient data:", err);
    throw err;
  }
};




module.exports = {updateMeds , getAllMedsAndMeals , createEmptyPatientSchedule};
