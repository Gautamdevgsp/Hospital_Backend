const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  disease: {
    type: String,
    required: true
  },
  
  appointment_created_at: {
    type: Date,
    default: Date.now   // automatically stores real-time date & time
  },

  appointment_date: {
    type: Date
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed"],
    default: "Pending"
  },

  diagnosis: String,

  prescription: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);