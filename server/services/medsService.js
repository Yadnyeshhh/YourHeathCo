const Patient = require('../models/meds_meal');
const AppError = require('../utils/appError');

class MedsService {
  async updateMeds(id, schedule) {
    if (!schedule) {
      throw new AppError("Schedule required", 400);
    }

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
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError("Patient schedule not found", 404);
    }

    return updated;
  }

  async createEmptyPatientSchedule(id) {
    if (!id) {
       throw new AppError("Patient ID is required", 400);
    }

    const existingPatient = await Patient.findOne({ id });
    if (existingPatient) {
      return { patient: existingPatient, isNew: false };
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
    return { patient: newPatient, isNew: true };
  }

  async getAllMedsAndMeals(patientId) {
    const patient = await Patient.findOne({ id: patientId }).lean();
    if (!patient) return null;

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
  }

  async resetSchedule(id) {
    if (!id) {
      throw new AppError('Patient ID is required', 400);
    }
    const defaultDay = {
      medicines: [],
      meal: { breakfast: null, lunch: null, dinner: null }
    };
    const defaultSchedule = {
      monday: defaultDay,
      tuesday: defaultDay,
      wednesday: defaultDay,
      thursday: defaultDay,
      friday: defaultDay,
      saturday: defaultDay,
      sunday: defaultDay
    };
    const updated = await Patient.findOneAndUpdate(
      { id },
      { $set: { schedule: defaultSchedule } },
      { new: true, upsert: true, runValidators: true }
    );
    return updated;
  }
}

module.exports = new MedsService();

