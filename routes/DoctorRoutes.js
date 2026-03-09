const express = require("express");

const router = express.Router();


const DoctorController = require("../apis/doctor/DoctorController");


router.post("/add-doctor",DoctorController.addDoctor);
router.get("/doctors",DoctorController.getAllDoctors);
router.put("/doctors/:id",DoctorController.updateDoctor);
router.delete("/doctors/:id",DoctorController.deleteDoctor);

module.exports = router;