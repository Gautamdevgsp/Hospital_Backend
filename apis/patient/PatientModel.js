const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  phone: String,
  address: String
});

module.exports = mongoose.model("Patient", patientSchema);