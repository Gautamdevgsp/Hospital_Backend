const express = require("express");
const router = express.Router();

const appointmentController = require("../apis/appointment/AppointmentController");

router.post("/book-appointment",appointmentController.bookAppointment);
router.get("/appointments",appointmentController.getAppointments);
router.delete("/appointments/:id",appointmentController.cancelAppointment);
router.get("/patient-record/:id",appointmentController.getPatientMedicalRecord);
router.put("/appointments/:id",appointmentController.updateAppointmentStatus);
router.get("/pending-appointments", appointmentController.getPendingAppointments);
router.put("/medical-record/:id", appointmentController.addMedicalRecord);
router.get("/patient-history/:id", appointmentController.getPatientHistory);

module.exports = router;
