const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const medRoutes = require("./routes/meds_meal.js");
const PatientStatusRoutes = require("./routes/patientStatusRoutes.js");
const appointmentRoutes = require("./routes/appointment.js");

const errorMiddleware = require("./middleware/errorMiddleware.js");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meds_meals", medRoutes);
app.use("/api/patient-status", PatientStatusRoutes);
app.use("/api/appointments", appointmentRoutes);

// Global Error Handler
app.use(errorMiddleware);

if (process.env.NODE_ENV) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} and connected to MongoDB`);
    });
  });
}

module.exports = app;
