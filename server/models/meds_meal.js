const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: String,
  time: String
}, { _id: false });

const mealSchema = new mongoose.Schema({
  breakfast: { type: String, default: null },
  lunch: { type: String, default: null },
  dinner: { type: String, default: null }
}, { _id: false });

const daySchema = new mongoose.Schema({
  medicines: { type: [medicineSchema], default: [] },
  meal: { type: mealSchema, default: {} }
}, { _id: false });

const weeklyScheduleSchema = new mongoose.Schema({
  monday: { type: daySchema, default: {} },
  tuesday: { type: daySchema, default: {} },
  wednesday: { type: daySchema, default: {} },
  thursday: { type: daySchema, default: {} },
  friday: { type: daySchema, default: {} },
  saturday: { type: daySchema, default: {} },
  sunday: { type: daySchema, default: {} }
}, { _id: false });

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  schedule: { type: weeklyScheduleSchema, default: {} }
});

module.exports = mongoose.model('Patient', patientSchema);
