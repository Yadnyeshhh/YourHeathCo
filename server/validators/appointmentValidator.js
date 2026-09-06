const { z } = require('zod');

const appointmentSchema = z.object({
  date: z.preprocess(arg => new Date(arg), z.date()),
  time: z.string().nonempty(),
  notes: z.string().optional(),
});

const appointmentValidator = {
  params: z.object({
    patientId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: appointmentSchema,
};

module.exports = { appointmentValidator };
