const { z } = require('zod');

const medicineSchema = z.object({
  name: z.string(),
  time: z.string().optional(),
});

const mealSchema = z.object({
  breakfast: z.string().nullable().optional(),
  lunch: z.string().nullable().optional(),
  dinner: z.string().nullable().optional(),
});

const dayScheduleSchema = z.object({
  medicines: z.array(medicineSchema).optional(),
  meal: mealSchema.optional(),
});

const updateMedsSchema = {
  body: z.object({
    schedule: z.object({
      monday: dayScheduleSchema.optional(),
      tuesday: dayScheduleSchema.optional(),
      wednesday: dayScheduleSchema.optional(),
      thursday: dayScheduleSchema.optional(),
      friday: dayScheduleSchema.optional(),
      saturday: dayScheduleSchema.optional(),
      sunday: dayScheduleSchema.optional(),
    }).optional() // Or strict if frontend sends all full schedule
  })
};

module.exports = {
  updateMedsSchema
};
