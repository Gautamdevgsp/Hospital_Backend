const Schedule = require("../schedule/ScheduleModel");
const Doctor = require("../doctor/DoctorModel");

const createSchedule = async (req, res) => {
  try {

    const { doctor_id, day_of_week, start_time, end_time, slot_duration } = req.body;

    if (!doctor_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        message: "doctor_id, day_of_week, start_time and end_time are required"
      });
    }

    const doctor = await Doctor.findById(doctor_id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    const schedule = await Schedule.create({
      doctor_id,
      doctor_name: doctor.name,
      doctorId: doctor.doctorId,
      day_of_week,
      start_time,
      end_time,
      slot_duration
    });

    res.status(201).json({
      message: "Schedule created successfully",
      schedule
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctorSchedule = async (req, res) => {
  try {

    const { doctor_id } = req.body;

    if (!doctor_id) {
      return res.status(400).json({
        message: "doctor_id is required"
      });
    }

    const schedules = await Schedule.find({
      doctor_id,
      is_active: true
    });

    if (!schedules.length) {
      return res.status(404).json({
        message: "No schedule found for this doctor"
      });
    }

    res.status(200).json({
      message: "Doctor schedule fetched successfully",
      schedules
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {

    const { schedule_id, start_time, end_time, slot_duration } = req.body;

    if (!schedule_id) {
      return res.status(400).json({
        message: "schedule_id is required"
      });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      schedule_id,
      { start_time, end_time, slot_duration },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestScheduleUpdate = async (req, res) => {
  try {

    const { doctor_id, requested_day, requested_start_time, requested_end_time } = req.body;

    if (!doctor_id) {
      return res.status(400).json({
        message: "doctor_id is required"
      });
    }

    const request = {
      doctor_id,
      requested_day,
      requested_start_time,
      requested_end_time,
      status: "Pending"
    };

    res.status(200).json({
      message: "Schedule update request sent to admin",
      request
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={
    createSchedule,
    updateSchedule,
    getDoctorSchedule,
    requestScheduleUpdate
}