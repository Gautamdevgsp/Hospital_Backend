const express = require("express");

const router = express.Router();


const DoctorController = require("../apis/doctor/DoctorController");


router.post("/add-doctor",DoctorController.addDoctor);
router.post("/doctors",DoctorController.getAllDoctors);
router.post("/updateDoctor",DoctorController.updateDoctor);
router.post("/deleteDoctor",DoctorController.deleteDoctor);

router.post("/add-schedule", DoctorController.addOrUpdateSchedule);      
router.get("/schedule/:doctorId", DoctorController.getDoctorSchedule);     
// router.delete("/delete-schedule-day", DoctorController.deleteScheduleDay); 
router.put("/book-slot", DoctorController.bookSlotById);

module.exports = router;