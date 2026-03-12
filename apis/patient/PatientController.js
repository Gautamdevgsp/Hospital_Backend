const Patient = require("../patient/PatientModel");
const User = require("../user/userModel");
const bcrypt = require("bcrypt");

/* ---------------- ADD PATIENT ---------------- */

const addPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      password,
      address,
      bloodGroup,
      medicalHistory,
      allergies,
      emergencyContact,
    } = req.body;

    /* ----------- VALIDATIONS ----------- */
    if (!name || !age || !gender || !phone || !email || !password || !address) {
      return res.status(400).json({
        error: "Name, age, gender, phone, email, password and address are required",
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        error: "Name must be at least 3 characters",
      });
    }

    if (age <= 0 || age > 120) {
      return res.status(400).json({
        error: "Age must be between 1 and 120",
      });
    }

    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        error: "Gender must be Male, Female, or Other",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        error: "Phone number must be 10 digits",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check duplicate email in User model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // ----------- HASH PASSWORD -----------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------- GENERATE CUSTOM PATIENT ID -----------
    const patientCount = await Patient.countDocuments();
    const patientId = "PAT" + String(patientCount + 1).padStart(3, "0");

    /* ----------- CREATE USER ENTRY ----------- */
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      userType: 4, // assuming 4 = Patient
    });

    /* ----------- CREATE PATIENT ENTRY ----------- */
    const patient = await Patient.create({
      patientId,
      userId: user._id,
      name,
      age,
      gender,
      phone,
      email,
      password: hashedPassword,
      address,
      bloodGroup,
      medicalHistory,
      allergies,
      emergencyContact,
      status: "active",
    });

    res.status(201).json({
      message: "Patient added successfully",
      patient,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ---------------- UPDATE PATIENT DETAILS ---------------- */


// const updatePatient = async (req, res) => {
//   try {
//     const {
//       patientId, // now coming in req.body
//       name,
//       phone,
//       email,
//       age,
//       gender,
//       address,
//       bloodGroup,
//       medicalHistory,
//       allergies,
//       emergencyContact,
//     } = req.body;

//     if (!patientId) {
//       return res.status(400).json({ message: "patientId is required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(patientId)) {
//       return res.status(400).json({ message: "Invalid patient ID" });
//     }

//     // -------- UPDATE PATIENT --------
//     const patient = await Patient.findById(patientId);
//     if (!patient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     if (name) patient.name = name;
//     if (phone) patient.phone = phone;
//     if (email) patient.email = email;
//     if (age !== undefined) patient.age = age;
//     if (gender) patient.gender = gender;
//     if (address) patient.address = address;
//     if (bloodGroup) patient.bloodGroup = bloodGroup;
//     if (medicalHistory) patient.medicalHistory = medicalHistory;
//     if (allergies) patient.allergies = allergies;
//     if (emergencyContact) patient.emergencyContact = emergencyContact;

//     await patient.save();

//     // -------- UPDATE LINKED USER --------
//     if (patient.userId) {
//       const user = await User.findById(patient.userId);
//       if (user) {
//         if (name) user.name = name;
//         if (phone) user.phone = phone;
//         if (email) user.email = email;

//         await user.save();
//       }
//     }

//     res.status(200).json({
//       message: "Patient updated successfully",
//       patient,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const updatePatient = async (req, res) => {
  try {

    const { patientId, name, phone, age, gender, address } = req.body;

    if (!patientId) {
      return res.status(400).json({
        error: "patientId is required"
      });
    }

    /* ---------- UPDATE PATIENT ---------- */

    const patient = await Patient.findOneAndUpdate(
      { patientId: patientId },
      { name, phone, age, gender, address },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found"
      });
    }

    /* ---------- UPDATE USER ALSO ---------- */

    await User.findByIdAndUpdate(
      patient.userId,
      { name, phone }
    );

    res.status(200).json({
      message: "Patient updated successfully",
      patient
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Patients
const getAllPatients = async (req, res) => {
  try {

    const patients = await Patient.find();

    if (patients.length === 0) {
      return res.status(404).json({
        message: "No patients found"
      });
    }

    res.status(200).json({
      message: "Patients fetched successfully",
      patients
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Delete Patient (using custom patientId)
const deletePatient = async (req, res) => {
  try {

    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        error: "patientId is required"
      });
    }

    // Find patient first
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found"
      });
    }

    // Delete user linked to patient
    if (patient.userId) {
      await User.findByIdAndDelete(patient.userId);
    }

    // Delete patient
    await Patient.deleteOne({ patientId });

    res.status(200).json({
      message: "Patient deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// Get Patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPatient,
  updatePatient,
  getAllPatients,
  getPatientById,
  deletePatient
}