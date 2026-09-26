const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    time: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false },
);

const daySchema = new mongoose.Schema(
  {
    medicines: { type: [entrySchema], default: [] },
    meals: { type: [entrySchema], default: [] },
  },
  { _id: false },
);

const weeklyScheduleSchema = new mongoose.Schema(
  {
    monday: { type: daySchema, default: {} },
    tuesday: { type: daySchema, default: {} },
    wednesday: { type: daySchema, default: {} },
    thursday: { type: daySchema, default: {} },
    friday: { type: daySchema, default: {} },
    saturday: { type: daySchema, default: {} },
    sunday: { type: daySchema, default: {} },
  },
  { _id: false },
);

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  schedule: { type: weeklyScheduleSchema, default: {} },
});

module.exports = mongoose.model("Patient", patientSchema);
