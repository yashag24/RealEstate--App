const mongoose = require("mongoose");

const PrePurchasePropertyVerificationSchema = new mongoose.Schema({
  FullName: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Address: { type: String, required: true },
  MessageOrPropertyDetails: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const PrePurchasePropertyVerification = mongoose.model(
  "Pre-Purchase-Property-Verification-Enquiry",
  PrePurchasePropertyVerificationSchema
);
module.exports = PrePurchasePropertyVerification;
