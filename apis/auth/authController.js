// // /apis/auth/authController.js
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { jwtSecret, jwtExpire } = require("../../config/config");

// // Models
// // const Admin = require("../admin/adminModel");
// const Doctor = require("../doctor/doctorModel");
// const Receptionist = require("../receptionist/receptionistModel");
// const Patient = require("../patient/patientModel");

// // -------------------- LOGIN --------------------
// // exports.loginAdmin = async (req, res) => {
// //     const { email, password } = req.body;
// //     if (!email || !password) return res.status(400).json({ message: "Email and password required" });

// //     const admin = await Admin.findOne({ email });
// //     if (!admin) return res.status(404).json({ message: "Admin not found" });

// //     const valid = bcrypt.compareSync(password, admin.password);
// //     if (!valid) return res.status(401).json({ message: "Invalid password" });

// //     const token = jwt.sign({ id: admin._id, role: "admin" }, jwtSecret, { expiresIn: jwtExpire });
// //     res.json({ message: "Login successful", token, adminId: admin._id, name: admin.name });
// // };

// const loginDoctor = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "Email and password required" });

//     const doctor = await Doctor.findOne({ email });
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     const valid = bcrypt.compareSync(password, doctor.password);
//     if (!valid) return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: doctor._id, role: "doctor" }, jwtSecret, { expiresIn: jwtExpire });
//     res.json({ message: "Login successful", token, doctorId: doctor._id, name: doctor.name });
// };

// const loginReceptionist = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "Email and password required" });

//     const receptionist = await Receptionist.findOne({ email });
//     if (!receptionist) return res.status(404).json({ message: "Receptionist not found" });

//     const valid = bcrypt.compareSync(password, receptionist.password);
//     if (!valid) return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: receptionist._id, role: "receptionist" }, jwtSecret, { expiresIn: jwtExpire });
//     res.json({ message: "Login successful", token, receptionistId: receptionist._id, name: receptionist.name });
// };

// // const loginPatient = async (req, res) => {
// //     const { email, password } = req.body;
// //     if (!email || !password) return res.status(400).json({ message: "Email and password required" });

// //     const patient = await Patient.findOne({ email });
// //     if (!patient) return res.status(404).json({ message: "Patient not found" });

// //     const valid = bcrypt.compareSync(password, patient.password);
// //     if (!valid) return res.status(401).json({ message: "Invalid password" });

// //     const token = jwt.sign({ id: patient._id, role: "patient" }, jwtSecret, { expiresIn: jwtExpire });
// //     res.json({ message: "Login successful", token, patientId: patient._id, name: patient.name });
// // };

// const loginPatient = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password required" });
//         }

//         const patient = await Patient.findOne({ email });

//         if (!patient) {
//             return res.status(404).json({ message: "Patient not found" });
//         }

//         // SAFETY CHECK: Ensure password exists
//         if (!patient.password) {
//             return res.status(500).json({ message: "Password is not set for this patient" });
//         }

//         const valid = bcrypt.compareSync(password, patient.password);

//         if (!valid) {
//             return res.status(401).json({ message: "Invalid password" });
//         }

//         const token = jwt.sign(
//             { id: patient._id, role: "patient" },
//             jwtSecret,
//             { expiresIn: jwtExpire }
//         );

//         res.json({
//             message: "Login successful",
//             token,
//             patientId: patient._id,
//             name: patient.name
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// const registerReceptionist = async (req, res) => {
//     try {
//         const { name, email, password, phone } = req.body;

//         if (!name || !email || !password || !phone) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Check if email already exists
//         const existing = await Receptionist.findOne({ email });
//         if (existing) {
//             return res.status(400).json({ message: "Receptionist already exists" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const receptionist = new Receptionist({
//             name,
//             email,
//             password: hashedPassword,
//             phone
//         });

//         await receptionist.save();

//         res.status(201).json({ message: "Receptionist registered successfully", receptionist });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const registerPatient = async (req, res) => {
//     try {
//         const { name, age, gender, email, password, phone, address } = req.body;

//         if (!name || !age || !gender || !email || !password || !phone || !address) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Check if email already exists
//         const existing = await Patient.findOne({ email });
//         if (existing) {
//             return res.status(400).json({ message: "Patient already exists" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const patient = new Patient({
//             name,
//             age,
//             gender,
//             email,
//             password: hashedPassword,
//             phone,
//             address
//         });

//         await patient.save();

//         res.status(201).json({ message: "Patient registered successfully", patient });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {
//   loginDoctor,
//   loginReceptionist,
//   loginPatient,
//   registerReceptionist,
//   registerPatient
// }