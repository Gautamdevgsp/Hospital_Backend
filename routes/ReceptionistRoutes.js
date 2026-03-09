const express = require("express");
const router = express.Router();

const receptionistController = require("../apis/Receptionist/ReceptionistController");


router.post("/add-receptionist",receptionistController.addReceptionist);
router.get("/receptionists",receptionistController.getReceptionists);
router.delete("/receptionists/:id",receptionistController.deleteReceptionist);

module.exports = router;