const express = require("express");
const EnquiryRouter = express.Router();
const Enquiry = require("../models/Enquiry");
const { default: mongoose } = require("mongoose");

EnquiryRouter.post("/create", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      messageEn,
      isGuest,
      staffId,
      userId,
      propertyId,
    } = req.body;

    if (!fullName || !email || !phoneNumber || !messageEn || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newEnquiry = new Enquiry({
      fullName,
      email,
      phoneNumber,
      messageEn,
      userId: userId || null,
      staffId,
      isGuest: isGuest || false,
      propertyId,
    });

    const savedEnquiry = await newEnquiry.save();

    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry: savedEnquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// view all
EnquiryRouter.get("/get-all-enquiry", async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("propertyId")
      .populate("userId");
    return res.status(200).json({
      success: true,
      enquiries: enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// delete single enquiry
EnquiryRouter.delete("/:enquiryId/delete", async (req, res) => {
  try {
    const { enquiryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const deletedEnquiry = await Enquiry.findByIdAndDelete(enquiryId);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      enquiry: deletedEnquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = EnquiryRouter;
