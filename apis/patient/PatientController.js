const Patient = require("../patient/PatientModel");



/* ---------------- ADD PATIENT ---------------- */

const addPatient = async (req,res)=>{
  try{

    const { name, age, gender, phone, disease } = req.body;

    /* ----------- VALIDATIONS ----------- */

    if(!name || !age || !gender || !phone){
      return res.status(400).json({
        error:"Name, age, gender and phone are required"
      });
    }

    if(name.length < 3){
      return res.status(400).json({
        error:"Name must be at least 3 characters"
      });
    }

    if(age <= 0 || age > 120){
      return res.status(400).json({
        error:"Age must be between 1 and 120"
      });
    }

    const validGenders = ["Male","Female","Other"];

    if(!validGenders.includes(gender)){
      return res.status(400).json({
        error:"Gender must be Male, Female, or Other"
      });
    }

    if(phone.length !== 10){
      return res.status(400).json({
        error:"Phone number must be 10 digits"
      });
    }


    /* -------- CREATE PATIENT -------- */

    const patient = new Patient({
      name,
      age,
      gender,
      phone,
      disease
    });

    const savedPatient = await patient.save();

    res.status(201).json({
      message:"Patient added successfully",
      patient:savedPatient
    });

  }catch(error){
    res.status(500).json({error:error.message});
  }
};


/* ---------------- UPDATE PATIENT DETAILS ---------------- */

const updatePatient = async (req,res)=>{
  try{

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.json(patient);

  }catch(error){
    res.status(500).json({error:error.message});
  }
};


// Get All Patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  getPatientById
}