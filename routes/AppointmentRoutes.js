const express = require("express");
const router = express.Router();

const appointmentController = require("../apis/appointment/AppointmentController");

router.post("/book-appointment",appointmentController.bookAppointment);
router.post("/appointments",appointmentController.getAppointments);
router.post("/cancel-appointment",appointmentController.cancelAppointment);
// router.get("/patient-record/:id",appointmentController.getPatientMedicalRecord);
router.post("/update-status",appointmentController.updateAppointmentStatus);
router.post("/doctor-pending-appointments",appointmentController.getDoctorPendingAppointments);
router.post("/pending-appointments", appointmentController.getAllPendingAppointments);
router.post("/add-medical-record", appointmentController.addMedicalRecord);
router.post("/patient-history", appointmentController.getPatientHistory);

module.exports = router;
