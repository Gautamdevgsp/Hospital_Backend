const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
{
  appointmentId: {
    type: String,
    unique: true
  },

  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  patientCustomId: {
    type: String,
    required: true
  },

  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  doctorCustomId: {
    type: String,
    required: true
  },

  receptionist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receptionist"
  },

  receptionistCustomId: {
    type: String
  },

  symptoms: {
    type: String,
    required: true
  },

  appointment_date: {
    type: Date,
    required: true
  },

  appointment_time: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
    default: "Pending"
  },

  diagnosis: String,

  prescription: String,

  notes: String
},
{ timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);