const mongoose = require("mongoose");

const receptionistSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String
});

const Receptionist = mongoose.models.Receptionist || mongoose.model("Receptionist", receptionistSchema);
module.exports = Receptionist;