const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require("./routes/user.js");
const adminRoutes = require('./routes/admin.js');
const medRoutes = require('./routes/meds_meal.js');
const PatientStatusRoutes = require('./routes/patientStatusRoutes.js');

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path);  
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meds_meals", medRoutes);
app.use("/api/patient-status", PatientStatusRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} and connected to MongoDB`);
  });
});
