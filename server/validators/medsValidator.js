const { z } = require('zod');

const entrySchema = z.object({
  label: z.string().optional().default(""),
  time: z.string().optional().default(""),
  done: z.boolean().optional().default(false),
});

const dayScheduleSchema = z.object({
  medicines: z.array(entrySchema).optional(),
  meals: z.array(entrySchema).optional(),
});

const updateMedsSchema = {
  body: z.object({
    schedule: z.record(z.string(), dayScheduleSchema).optional(),
  })
};

module.exports = {
  updateMedsSchema
};
