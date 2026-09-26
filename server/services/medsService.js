const Patient = require('../models/meds_meal');
const AppError = require('../utils/appError');

class MedsService {
  async updateMeds(id, schedule) {
    if (!schedule) {
      throw new AppError("Schedule required", 400);
    }

    // Ensure patient schedule document exists first
    await this.createEmptyPatientSchedule(id);

    const updateQuery = Object.entries(schedule).reduce((acc, [day, data]) => {
      if (data.medicines) {
        const cleanMeds = (data.medicines || [])
          .filter(m => m && (m.label || m.time))
          .map(m => ({
            label: m.label && m.label.trim() ? m.label.trim() : (m.time ? `Med at ${m.time}` : "Medication"),
            time: m.time && m.time.trim() ? m.time.trim() : "08:00",
            done: Boolean(m.done)
          }));
        acc[`schedule.${day}.medicines`] = cleanMeds;
      }
      if (data.meals) {
        const cleanMeals = (data.meals || [])
          .filter(m => m && (m.label || m.time))
          .map(m => ({
            label: m.label && m.label.trim() ? m.label.trim() : (m.time ? `Meal at ${m.time}` : "Meal"),
            time: m.time && m.time.trim() ? m.time.trim() : "12:00",
            done: Boolean(m.done)
          }));
        acc[`schedule.${day}.meals`] = cleanMeals;
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
      meals: []
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
        meals: dayData?.meals || []
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
      meals: []
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

