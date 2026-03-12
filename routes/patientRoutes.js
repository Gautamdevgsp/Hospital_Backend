const express = require("express");
const router = express.Router();

const  PatientController = require("../apis/patient/PatientController");

router.post("/add-patient", PatientController.addPatient);
router.post("/update-patient", PatientController.updatePatient);
router.post("/patients",PatientController.getAllPatients);
router.post("/delete-patient",PatientController.deletePatient);
router.get("/patient/:id",PatientController.getPatientById);

module.exports = router;