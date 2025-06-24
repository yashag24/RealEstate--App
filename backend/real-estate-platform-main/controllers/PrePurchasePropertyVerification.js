const express = require("express");
const PrePurchaseProVerRouter = express.Router();
const PrePurchasePropertyVerification = require("../models/PrePurchaseProVer.js");

// Submit a new title search request
PrePurchaseProVerRouter.post("/create-enquiry", async (req, res) => {
  try {
    const { FullName, Email, Phone, Address, MessageOrPropertyDetails } =
      req.body;

    if (
      !FullName ||
      !Email ||
      !Phone ||
      !Address ||
      !MessageOrPropertyDetails
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const newEnquiry = new PrePurchasePropertyVerification({
      FullName,
      Email,
      Phone,
      Address,
      MessageOrPropertyDetails,
    });

    await newEnquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      requestId: newEnquiry._id,
    });
  } catch (err) {
    console.error("Enquiry submission error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// staff list of request
PrePurchaseProVerRouter.get("/list", async (req, res) => {
  try {
    const allRequests = await PrePurchasePropertyVerification.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      allRequests,
    });
  } catch (err) {
    console.error("Fetching enquiry requests failed:", err);
    res.status(500).json({
      success: false,
      message: "Could not retrieve requests.",
    });
  }
});

module.exports = PrePurchaseProVerRouter;
