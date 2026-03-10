// /apis/auth/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../apis/auth/authController");

// Admin
// router.post("/login/admin", authController.loginAdmin);

// Doctor
router.post("/login/doctor", authController.loginDoctor);

// Receptionist
router.post("/login/receptionist", authController.loginReceptionist);

// Patient
router.post("/login/patient", authController.loginPatient);

router.post("/register/receptionist", authController.registerReceptionist);
router.post("/register/patient", authController.registerPatient);

module.exports = router;