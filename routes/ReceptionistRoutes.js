const express = require("express");
const router = express.Router();

const receptionistController = require("../apis/Receptionist/ReceptionistController");

router.post("/add-receptionist",receptionistController.addReceptionist);
router.post("/receptionists",receptionistController.getReceptionists);
router.post("/receptionists/delete",receptionistController.deleteReceptionist);
router.post("/receptionist/book-appointment", receptionistController.bookAppointment);
router.post("/dashboard",receptionistController.receptionistDashboard);
module.exports = router;