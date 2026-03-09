const mongoose = require("mongoose");

const receptionistSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String
});

module.exports = mongoose.model("Receptionist", receptionistSchema);