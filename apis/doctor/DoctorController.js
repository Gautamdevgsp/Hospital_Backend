const Doctor = require("../doctor/DoctorModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../user/userModel");
const Schedule = require("../schedule/ScheduleModel");


const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      department,
      schedules, // array of schedule objects [{ day_of_week, start_time, end_time, slot_duration }]
    } = req.body;

    // ---------------- Validation ----------------
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !specialization ||
      !qualification ||
      !consultationFee
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------- CREATE USER ----------------
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      userType: 2, // doctor
    });

    // Generate custom doctorId
    const doctorCount = await Doctor.countDocuments();
    const doctorId = "DOC" + String(doctorCount + 1).padStart(3, "0");

    // ---------------- CREATE DOCTOR ----------------
    const doctor = await Doctor.create({
      doctorId,
      userId: user._id,
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      phone,
      department,
    });

    // ---------------- CREATE SCHEDULES ----------------
    if (schedules && schedules.length > 0) {
      const scheduleDocs = schedules.map((s) => ({
        doctor_id: doctor._id,
        doctorId: doctor.doctorId,
        doctor_name: name,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        slot_duration: s.slot_duration || 30, // default 30 min
        is_active: s.is_active !== undefined ? s.is_active : true,
      }));

      await Schedule.insertMany(scheduleDocs);
    }

    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- GET ALL DOCTORS ---------------- */
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email phone");

    if (!doctors.length) {
      return res.status(404).json({
        message: "No doctors found",
      });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- UPDATE DOCTOR ---------------- */
const updateDoctor = async (req, res) => {
  try {
    const {
      doctorId,
      name,
      phone,
      email,
      specialization,
      qualification,
      experience,
      consultationFee,
      department,
      schedules, // array of schedule objects [{ day_of_week, start_time, end_time, slot_duration, is_active }]
      status,
    } = req.body;

    // 1️⃣ Find doctor by custom doctorId
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    /* -------- UPDATE DOCTOR MODEL -------- */
    if (name) doctor.name = name;
    if (phone) doctor.phone = phone;
    if (email) doctor.email = email;
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (department) doctor.department = department;
    if (status) doctor.status = status;

    await doctor.save();

    /* -------- UPDATE USER MODEL -------- */
    const user = await User.findById(doctor.userId);
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (email) user.email = email;
      await user.save();
    }

    /* -------- UPDATE SCHEDULES -------- */
    if (schedules && schedules.length > 0) {
      // Remove all old schedules for this doctor
      await Schedule.deleteMany({ doctorId: doctor.doctorId });

      // Insert new schedules
      const scheduleDocs = schedules.map((s) => ({
        doctor_id: doctor._id,
        doctorId: doctor.doctorId,
        doctor_name: doctor.name,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        slot_duration: s.slot_duration || 30,
        is_active: s.is_active !== undefined ? s.is_active : true,
      }));

      await Schedule.insertMany(scheduleDocs);
    } else if (name) {
      // If schedules not provided but name changed, update doctor_name in existing schedules
      await Schedule.updateMany(
        { doctorId: doctor.doctorId },
        { $set: { doctor_name: name } }
      );
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/* ---------------- DELETE DOCTOR ---------------- */

const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    // Find doctor by custom doctorId
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Delete schedules linked to this doctor
    await Schedule.deleteMany({ doctorId: doctor.doctorId });

    // Delete doctor
    await Doctor.findByIdAndDelete(doctor._id);

    // Delete linked user
    await User.findByIdAndDelete(doctor.userId);

    res.status(200).json({ message: "Doctor, User, and Schedules deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ---------------- ADD/UPDATE DOCTOR SCHEDULE ---------------- */
const addOrUpdateSchedule = async (req, res) => {
  try {
    const { doctorId, date, slots } = req.body;

    if (!doctorId || !date || !slots || !slots.length) {
      return res
        .status(400)
        .json({ message: "doctorId, date and slots are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if date already exists in schedule
    const existingDay = doctor.schedule.find(
      (d) =>
        d.date.toISOString().slice(0, 10) ===
        new Date(date).toISOString().slice(0, 10),
    );
    if (existingDay) {
      // Update slots for existing day
      existingDay.slots = slots;
    } else {
      // Add new day with slots
      doctor.schedule.push({ date, slots });
    }

    await doctor.save();
    res.json({
      message: "Schedule saved successfully",
      schedule: doctor.schedule,
    });
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
      schedule: doctor.schedule,
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
      return res
        .status(400)
        .json({ message: "doctorId and slotId are required" });
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
  // deleteScheduleDay,
  bookSlotById,
};
