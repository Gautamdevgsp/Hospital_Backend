const Patient = require("../patient/PatientModel");
const Doctor = require("../doctor/DoctorModel");
const Receptionist = require("../Receptionist/ReceptionistModel");
const Appointment = require("../appointment/AppointmentModel");
const Schedule = require("../schedule/ScheduleModel");

const mongoose = require("mongoose");

/* ---------------- BOOK APPOINTMENT ---------------- */
const bookAppointment = async (req, res) => {
  try {

    const {
      patient_id,
      doctor_id,
      receptionist_id,
      appointment_date,
      appointment_time,
      symptoms
    } = req.body;

    // get patient
    const patient = await Patient.findById(patient_id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // get doctor
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // receptionist may be optional
    let receptionist = null;
    if (receptionist_id) {
      receptionist = await Receptionist.findById(receptionist_id);
      if (!receptionist) {
        return res.status(404).json({ message: "Receptionist not found" });
      }
    }

    // Get day of week
    const dayOfWeek = new Date(appointment_date).getDay();

    // Find doctor schedule
    const schedule = await Schedule.findOne({
      doctor_id,
      day_of_week: dayOfWeek,
      is_active: true
    });

    if (!schedule) {
      return res.status(400).json({
        message: "Doctor is not available on this day"
      });
    }

    // check time range
    if (
      appointment_time < schedule.start_time ||
      appointment_time >= schedule.end_time
    ) {
      return res.status(400).json({
        message: "Appointment time is outside doctor's schedule"
      });
    }

    // check existing appointment
    const existingAppointment = await Appointment.findOne({
      doctor_id,
      appointment_date,
      appointment_time,
      status: { $in: ["Pending", "Approved"] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Doctor already has an appointment at this time"
      });
    }

    // generate custom appointmentId
    const lastAppointment = await Appointment.findOne().sort({ createdAt: -1 });

    let appointmentId = "APT001";

    if (lastAppointment && lastAppointment.appointmentId) {
      const lastNumber = parseInt(lastAppointment.appointmentId.slice(3));
      appointmentId = "APT" + String(lastNumber + 1).padStart(3, "0");
    }

    // create appointment
    const appointment = await Appointment.create({

      appointmentId,

      patient_id,
      patientCustomId: patient.patientId,

      doctor_id,
      doctorCustomId: doctor.doctorId,

      receptionist_id: receptionist ? receptionist._id : null,
      receptionistCustomId: receptionist ? receptionist.receptionistId : null,

      appointment_date,
      appointment_time,
      symptoms

    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
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

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Appointment id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid appointment ID"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ---------------- VIEW PATIENT MEDICAL RECORD ---------------- */
// const getPatientMedicalRecord = async (req, res) => {
//   try {

//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         message: "Invalid patient ID"
//       });
//     }

//     const records = await Appointment
//       .find({ patient_id: id })
//       .populate("doctor_id");

//     if (!records.length) {
//       return res.status(404).json({
//         message: "No medical records found"
//       });
//     }

//     res.json(records);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

/* ---------------- APPROVE / REJECT APPOINTMENT ---------------- */
const updateAppointmentStatus = async (req, res) => {
  try {

    const { id, status } = req.body;

    const validStatus = ["Pending", "Approved", "Rejected", "Completed"];

    if (!id || !status) {
      return res.status(400).json({
        message: "Appointment id and status are required"
      });
    }

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

    res.status(200).json({
      message: "Appointment status updated",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- PENDING APPOINTMENTS ---------------- */
const getAllPendingAppointments = async (req, res) => {
  try {

    const appointments = await Appointment
      .find({ status: "Pending" })
      // .populate("patient_id")
      // .populate("doctor_id")
      // .populate("receptionist_id");

    if (!appointments.length) {
      return res.status(404).json({
        message: "No pending appointments"
      });
    }

    res.status(200).json({
      message: "Pending appointments fetched successfully",
      appointments
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getDoctorPendingAppointments = async (req, res) => {
  try {

    const { doctor_id } = req.body;

    if (!doctor_id) {
      return res.status(400).json({
        message: "doctor_id is required"
      });
    }

    const appointments = await Appointment
      .find({
        doctor_id: doctor_id,
        status: "Pending"
      })
      // .populate("patient_id")
      // .populate("doctor_id")
      // .populate("receptionist_id");

    if (!appointments.length) {
      return res.status(404).json({
        message: "No pending appointments for this doctor"
      });
    }

    res.status(200).json({
      message: "Doctor pending appointments fetched successfully",
      appointments
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ---------------- ADD DIAGNOSIS + PRESCRIPTION ---------------- */
const addMedicalRecord = async (req, res) => {
  try {

    const { appointmentId, diagnosis, prescription } = req.body;

    if (!appointmentId || !diagnosis || !prescription) {
      return res.status(400).json({
        message: "appointmentId, diagnosis and prescription are required"
      });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId: appointmentId },
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

    res.status(200).json({
      message: "Medical record added successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ---------------- GET PATIENT HISTORY ---------------- */
const getPatientHistory = async (req, res) => {
  try {

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Patient id is required"
      });
    }

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

    res.status(200).json({
      message: "Patient history fetched successfully",
      history
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- EXPORTS ---------------- */

module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  // getPatientMedicalRecord,
  updateAppointmentStatus,
  getAllPendingAppointments,
  addMedicalRecord,
  getPatientHistory,
  getDoctorPendingAppointments
};