const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    
    patientId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    medicalHistory: [
      {
        disease: String,
        description: String,
        treatment: String,
        date: Date,
      },
    ],
    allergies: [String],
    
    emergencyContact: {
      name: String,
      phone: { type: String, match: [/^\d{10}$/, "Phone number must be 10 digits"] },
      relation: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
module.exports = Patient;