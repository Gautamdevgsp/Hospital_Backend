const express = require("express");

const router = express.Router();


const DoctorController = require("../apis/doctor/DoctorController");


router.post("/add-doctor",DoctorController.addDoctor);
router.get("/doctors",DoctorController.getAllDoctors);
router.put("/doctors/:id",DoctorController.updateDoctor);
router.delete("/doctors/:id",DoctorController.deleteDoctor);

router.post("/add-schedule", DoctorController.addOrUpdateSchedule);      
router.get("/schedule/:doctorId", DoctorController.getDoctorSchedule);     
router.delete("/delete-schedule-day", DoctorController.deleteScheduleDay); 
router.put("/book-slot", DoctorController.bookSlotById);

module.exports = router;