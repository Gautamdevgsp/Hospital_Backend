const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const createAdminSeeder = require("./config/seed");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const patientRoutes = require("./routes/patientRoutes");
const AppointmentRoutes = require("./routes/AppointmentRoutes");
const receptionistRoutes = require("./routes/ReceptionistRoutes");
const doctorRoutes = require("./routes/DoctorRoutes");
const authRoutes = require("./routes/AuthRoutes");
const scheduleRoutes = require("./routes/ScheduleRoutes");

app.use("/api/patient", patientRoutes);
app.use("/api/appointment", AppointmentRoutes);
app.use("/api/recp", receptionistRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schedule",scheduleRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});