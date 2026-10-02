const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const medRoutes = require("./routes/meds_meal.js");
const PatientStatusRoutes = require("./routes/patientStatusRoutes.js");
const appointmentRoutes = require("./routes/appointment.js");
const doctorRoutes = require("./routes/doctor.js");
const notificationRoutes = require("./routes/notification.js");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meds_meals", medRoutes);
app.use("/api/patient-status", PatientStatusRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/notifications", notificationRoutes);

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
