const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
{
  doctorId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
   name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  qualification: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    default: 0
  },

  consultationFee: {
    type: Number,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  department: {
    type: String
  },

  // schedule: [
  //   {
  //     day: String,
  //     startTime: String,
  //     endTime: String
  //   }
  // ],

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
},

{ timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);