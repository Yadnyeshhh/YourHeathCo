const { z } = require('zod');

const appointmentSchema = z.object({
  title: z.string().optional(),
  date: z.preprocess(arg => (arg ? new Date(arg) : undefined), z.date()),
  time: z.string().optional(),
  doctorName: z.string().optional(),
  doctorRole: z.string().optional(),
  location: z.string().optional(),
  mode: z.enum(['In-person', 'Telehealth']).optional(),
  notes: z.string().optional(),
});

const appointmentValidator = {
  params: z.object({
    patientId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: appointmentSchema,
};

module.exports = { appointmentValidator };
