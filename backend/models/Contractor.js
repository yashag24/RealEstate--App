const mongoose = require("mongoose");

const previousWorkSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String], // URLs of previous work images
  completedOn: Date,
  location: String,
});

const contractorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
  location: String,
  serviceType: {
    type: String,
    enum: ["Civil", "Electrical", "Plumbing", "Full Construction", "Interior", "Other"],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  portfolio: [previousWorkSchema], // Array of past projects
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contractor", contractorSchema);
