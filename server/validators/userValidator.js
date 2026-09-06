const { z } = require('zod');

const signupSchema = {
  body: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    age: z.number().int().positive().optional(),
    gender: z.string().optional(),
    contact: z.string().optional(),
    bloodGroup: z.string().optional(),
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  })
};

const updateSchema = {
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.number().int().positive().optional(),
    gender: z.string().optional(),
    contact: z.string().optional(),
    bloodGroup: z.string().optional(),
    // Keep out sensitive fields just in case
  })
};

const searchSchema = {
  query: z.object({
    query: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    minAge: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxAge: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
  })
};

module.exports = {
  signupSchema,
  loginSchema,
  updateSchema,
  searchSchema
};
