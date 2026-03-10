const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  email: String,
  password: String,
  phone: String,

   schedule: [
    {
      date: { type: Date, required: true },
      slots: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          startTime: { type: String, required: true }, 
          endTime: { type: String, required: true },  
          isBooked: { type: Boolean, default: false }
        }
      ]
    }
  ]
}, { timestamps: true });



const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;