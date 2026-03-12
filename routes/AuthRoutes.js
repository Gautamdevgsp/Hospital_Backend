// /apis/auth/authRoutes.js
const express = require("express");
const router = express.Router();
// const authController = require("../apis/auth/authController");
const verifyToken = require("../middleware/verifytoken")

const { loginUser, changePassword } = require("../apis/user/userController")


router.post("/login", loginUser)
router.post("/changepassword",  verifyToken, changePassword)

module.exports = router;