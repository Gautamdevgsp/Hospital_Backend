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


/* ---------------- ADD/UPDATE DOCTOR SCHEDULE ---------------- */
const addOrUpdateSchedule = async (req, res) => {
  try {
    const { doctorId, date, slots } = req.body;

    if (!doctorId || !date || !slots || !slots.length) {
      return res.status(400).json({ message: "doctorId, date and slots are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if date already exists in schedule
    const existingDay = doctor.schedule.find(d => d.date.toISOString().slice(0,10) === new Date(date).toISOString().slice(0,10));
    if (existingDay) {
      // Update slots for existing day
      existingDay.slots = slots;
    } else {
      // Add new day with slots
      doctor.schedule.push({ date, slots });
    }

    await doctor.save();
    res.json({ message: "Schedule saved successfully", schedule: doctor.schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- GET DOCTOR SCHEDULE ---------------- */
const getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({
      doctorId: doctor._id,
      name: doctor.name,
      email: doctor.email,
      schedule: doctor.schedule
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ---------------- BOOK SLOT ---------------- */
const bookSlotById = async (req, res) => {
  try {
    const { doctorId, slotId } = req.body;

    if (!doctorId || !slotId) {
      return res.status(400).json({ message: "doctorId and slotId are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    let slotFound = false;

    // Iterate through schedule to find the slot
    for (let day of doctor.schedule) {
      let slot = day.slots.id(slotId); // Mongoose allows subdocument find by id
      if (slot) {
        if (slot.isBooked) {
          return res.status(400).json({ message: "Slot already booked" });
        }
        slot.isBooked = true;
        slotFound = true;
        break;
      }
    }

    if (!slotFound) {
      return res.status(404).json({ message: "Slot not found" });
    }

    await doctor.save();
    res.json({ message: "Slot booked successfully", doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    addDoctor,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    addOrUpdateSchedule,
    getDoctorSchedule,
    deleteScheduleDay,
    bookSlotById
}