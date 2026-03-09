const Appointment = require("../appointment/AppointmentModel");
const mongoose = require("mongoose");

/* ---------------- BOOK APPOINTMENT ---------------- */

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


/* ---------------- VIEW ALL APPOINTMENTS ---------------- */

const getAppointments = async (req, res) => {
  try {

    const appointments = await Appointment
      .find()
      .populate("patient_id")
      .populate("doctor_id");

    if (!appointments.length) {
      return res.status(404).json({
        message: "No appointments found"
      });
    }

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- CANCEL APPOINTMENT ---------------- */

const cancelAppointment = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid appointment ID"
      });
    }

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Appointment cancelled successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ---------------- VIEW PATIENT MEDICAL RECORD ---------------- */

const getPatientMedicalRecord = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid patient ID"
      });
    }

    const records = await Appointment
      .find({ patient_id: id })
      .populate("doctor_id");

    if (!records.length) {
      return res.status(404).json({
        message: "No medical records found"
      });
    }

    res.json(records);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- APPROVE / REJECT APPOINTMENT ---------------- */

const updateAppointmentStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["Pending", "Approved", "Rejected", "Completed"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid appointment ID"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Appointment status updated",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- PENDING APPOINTMENTS ---------------- */

const getPendingAppointments = async (req, res) => {
  try {

    const appointments = await Appointment
      .find({ status: "Pending" })
      .populate("patient_id")
      .populate("doctor_id");

    if (!appointments.length) {
      return res.status(404).json({
        message: "No pending appointments"
      });
    }

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- ADD DIAGNOSIS + PRESCRIPTION ---------------- */

const addMedicalRecord = async (req, res) => {
  try {

    const { id } = req.params;
    const { diagnosis, prescription } = req.body;

    if (!diagnosis || !prescription) {
      return res.status(400).json({
        message: "Diagnosis and prescription are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid appointment ID"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        diagnosis,
        prescription,
        status: "Completed"
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Medical record added successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- GET PATIENT HISTORY ---------------- */

const getPatientHistory = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid patient ID"
      });
    }

    const history = await Appointment
      .find({ patient_id: id })
      .populate("doctor_id");

    if (!history.length) {
      return res.status(404).json({
        message: "No history found for this patient"
      });
    }

    res.json(history);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ---------------- EXPORTS ---------------- */

module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getPatientMedicalRecord,
  updateAppointmentStatus,
  getPendingAppointments,
  addMedicalRecord,
  getPatientHistory
};