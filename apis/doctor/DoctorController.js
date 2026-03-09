const Doctor = require("../doctor/DoctorModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* ---------------- ADD DOCTOR ---------------- */

const addDoctor = async (req, res) => {
  try {

    const { name, specialization, email, password, phone } = req.body;

    if (!name || !specialization || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    // Check duplicate doctor
    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      specialization,
      email,
      password: hashedPassword,
      phone
    });

    await doctor.save();

    res.status(201).json({
      message: "Doctor Added Successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- GET ALL DOCTORS ---------------- */

const getAllDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find();

    if (!doctors.length) {
      return res.status(404).json({
        message: "No doctors found"
      });
    }

    res.json(doctors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ---------------- UPDATE DOCTOR ---------------- */

const updateDoctor = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Doctor ID"
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    res.json({
      message: "Doctor updated Successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




/* ---------------- DELETE DOCTOR ---------------- */

const deleteDoctor = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Doctor ID"
      });
    }

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    res.json({
      message: "Doctor Deleted Successfully",
      doctor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
    addDoctor,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
}