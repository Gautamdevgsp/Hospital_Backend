const express = require("express");
const router = express.Router();
const ScheduleController = require("../apis/schedule/ScheduleController");

router.post("/create-schedule", ScheduleController.createSchedule);
router.post("/get-doctor-schedule", ScheduleController.getDoctorSchedule);
router.post("/update-schedule", ScheduleController.updateSchedule);
router.post("/request-schedule-update", ScheduleController.requestScheduleUpdate);

module.exports = router;