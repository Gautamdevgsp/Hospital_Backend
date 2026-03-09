const express = require("express");
const router = express.Router();

const  PatientController = require("../apis/patient/PatientController");

router.post("/add-patient", PatientController.addPatient);
router.put("/patient/:id", PatientController.updatePatient);
router.get("/patients",PatientController.getAllPatients);
router.get("/patient/:id",PatientController.getPatientById);

module.exports = router;