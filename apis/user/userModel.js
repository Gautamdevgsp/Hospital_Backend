const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  userAutoId: {
    type: Number,
    default: 0
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

   userType: { type: Number, default: 4 }, 
    // 1 > Admin
    // 2 > Doctor
    // 3 > Receptionist
    // 4 > Patient

  addedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  updatedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  status: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: null
  }

});

const User = mongoose.model("User", userSchema);
module.exports = User;