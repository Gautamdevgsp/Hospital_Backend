
const Receptionist = require("../Receptionist/ReceptionistModel");
const bcrypt = require("bcrypt");
const User = require("../user/userModel");
const Patient = require("../patient/PatientModel");
const Appointment = require("../appointment/AppointmentModel");


// const Doctor = require("../models/DoctorModel");



/* ---------------- RECEPTIONIST APIs ---------------- */

// Add Receptionist
const addReceptionist = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      age,
      gender,
      qualification,
      experience,
      assignedDepartments,
      shift
    } = req.body;

    // ----------- VALIDATIONS -------------
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Name, email, phone, and password are required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format" });

    if (phone.length !== 10) return res.status(400).json({ error: "Phone number must be 10 digits" });

    // Check duplicate email in UserModel
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User with this email already exists" });

    // -------- PASSWORD HASHING --------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // -------- CREATE USER --------
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      userType: 3 // Receptionist
    });

    // -------- GENERATE CUSTOM RECEPTIONIST ID --------
    const receptionistCount = await Receptionist.countDocuments();
    const receptionistId = "REC" + String(receptionistCount + 1).padStart(3, "0");

    // -------- CREATE RECEPTIONIST --------
    const receptionist = await Receptionist.create({
      receptionistId,
      userId: user._id,
      name,
      email,
      phone,
      age,
      gender,
      qualification,
      experience,
      assignedDepartments,
      shift
    });

    res.status(201).json({
      message: "Receptionist Added Successfully",
      user,
      receptionist
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all Receptionists (POST)
const getReceptionists = async (req, res) => {
  try {
    // No need to read anything from req.body since we just want all receptionists
    const receptionists = await Receptionist.find({ isDeleted: false })
      .populate("userId", "name email phone");

    if (!receptionists.length) {
      return res.status(404).json({
        message: "No receptionists found"
      });
    }

    res.status(200).json(receptionists);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Receptionist (POST)
const deleteReceptionist = async (req, res) => {
  try {
    const { receptionistId } = req.body;

    if (!receptionistId) {
      return res.status(400).json({ error: "receptionistId is required" });
    }

    // Find receptionist by custom receptionistId
    const receptionist = await Receptionist.findOne({ receptionistId });

    if (!receptionist) {
      return res.status(404).json({ error: "Receptionist not found" });
    }

    // Delete linked user
    if (receptionist.userId) {
      await User.findByIdAndDelete(receptionist.userId);
    }

    // Delete receptionist
    await Receptionist.findOneAndDelete({ receptionistId });

    res.status(200).json({
      message: "Receptionist deleted successfully",
      receptionist
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const bookAppointment = async (req, res) => {
  try {

    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(patient_id) || !mongoose.Types.ObjectId.isValid(doctor_id)) {
      return res.status(400).json({
        message: "Invalid patient or doctor ID"
      });
    }

    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const receptionistDashboard = async (req, res) => {
  try {

    const totalPatients = await Patient.countDocuments();

    const totalAppointments = await Appointment.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending"
    });

    const today = new Date();
    today.setHours(0,0,0,0);

    const todayBookings = await Appointment.countDocuments({
      appointment_date: { $gte: today }
    });

    res.status(200).json({
      message: "Receptionist dashboard data fetched",
      dashboard: {
        totalPatients,
        totalAppointments,
        pendingAppointments,
        todayBookings
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  addReceptionist,
  getReceptionists,
  deleteReceptionist,
  bookAppointment,
  receptionistDashboard
}