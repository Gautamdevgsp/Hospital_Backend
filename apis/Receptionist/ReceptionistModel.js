const mongoose = require("mongoose");

const receptionistSchema = mongoose.Schema({
  receptionistId: { type: String, required: true, unique: true }, // custom ID like REC001
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },

  age: { type: Number, min: 18, max: 65 },
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  shift: { type: String, enum: ["morning", "evening", "night"], default: "morning" },
  
  qualification: { type: String, default: null },
  experience: { type: Number, default: 0 }, 
  assignedDepartments: [{ type: String }], 

  addedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  updatedById: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  status: { type: Boolean, default: true },      
  isDeleted: { type: Boolean, default: false }   
},
{
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
});

module.exports = mongoose.model("receptionist", receptionistSchema);