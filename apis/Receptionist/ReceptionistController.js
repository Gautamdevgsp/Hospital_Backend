
const Receptionist = require("../Receptionist/ReceptionistModel");
const bcrypt = require("bcrypt");

// const Doctor = require("../models/DoctorModel");



/* ---------------- RECEPTIONIST APIs ---------------- */


// Add Receptionist
const addReceptionist = async (req, res) => {
  try {

    const { name, email, phone, password } = req.body;

    // ----------- VALIDATIONS -------------

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }


    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format"
      });
    }


    if (phone.length !== 10) {
      return res.status(400).json({
        error: "Phone number must be 10 digits"
      });
    }
    
    const existingReceptionist = await Receptionist.findOne({ email });

    if (existingReceptionist) {
      return res.status(400).json({
        error: "Receptionist with this email already exists"
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // -------- CREATE RECEPTIONIST --------

    const receptionist = new Receptionist({
      name,
      email,
      phone,
      password: hashedPassword
    });

    await receptionist.save();

    res.status(201).json({
      message: "Receptionist Added Successfully",
      receptionist
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Receptionists
const getReceptionists = async (req, res) => {
  try {

    const receptionists = await Receptionist.find();

    if (receptionists.length === 0) {
      return res.status(404).json({
        message: "No receptionists found"
      });
    }

    res.status(200).json(receptionists);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Receptionist
const deleteReceptionist = async (req, res) => {
  try {

    const receptionist = await Receptionist.findByIdAndDelete(req.params.id);

    if (!receptionist) {
      return res.status(404).json({
        error: "Receptionist not found"
      });
    }

    res.status(200).json({
      message: "Receptionist Deleted Successfully",
      receptionist
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addReceptionist,
  getReceptionists,
  deleteReceptionist
}