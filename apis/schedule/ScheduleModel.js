const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

   doctor_name: {              // <--- add this
    type: String,
    required: true
  },
   doctorId: {       // <--- custom doctorId like DOC001
    type: String,
    required: true
  },
  day_of_week: {
    type: Number,
    min: 0,
    max: 6,
    required: true
  },
  start_time: {
    type: String, // e.g., "09:00"
    required: true
  },
  end_time: {
    type: String, // e.g., "17:00"
    required: true
  },
  slot_duration: {
    type: Number, // in minutes
    default: 30
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);