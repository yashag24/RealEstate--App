const express = require("express");
const TitleSearchRouter = express.Router();
const TitleSearchRequest = require("../models/TitleSearchRequest");
const { upload } = require("../middleware/multer.middleware.js");
const { uploadOnCloudinary } = require("../util/cloudinary.js");

// Submit a new title search request
TitleSearchRouter.post(
  "/create-request",
  upload.array("Documents", 5),
  async (req, res) => {
    try {
      const {
        propertyAddress,
        PropertyCity,
        PropertyState,
        propertyType,
        PropertyRegistrationNumber,
        ContactFullName,
        ContactEmail,
        ContactPhone,
        ContactNotes,
      } = req.body;

      if (
        !propertyAddress ||
        !PropertyCity ||
        !PropertyState ||
        !propertyType ||
        !PropertyRegistrationNumber ||
        !ContactFullName ||
        !ContactEmail ||
        !ContactPhone
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });
      }

      let uploadedFiles = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploaded = await uploadOnCloudinary(file.path);
          if (uploaded) {
            uploadedFiles.push({
              url: uploaded.secure_url,
              public_id: uploaded.public_id,
            });
          }
        }
      }

      const newRequest = new TitleSearchRequest({
        propertyAddress,
        PropertyCity,
        PropertyState,
        propertyType,
        PropertyRegistrationNumber,
        ContactFullName,
        ContactEmail,
        ContactPhone,
        ContactNotes,
        propertyDocuments: uploadedFiles,
      });

      await newRequest.save();

      res.status(201).json({
        success: true,
        message: "Request submitted successfully.",
        requestId: newRequest._id,
        documents: uploadedFiles,
      });
    } catch (err) {
      console.error("Title search submission error:", err);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }
);

// staff list of request
TitleSearchRouter.get("/list", async (req, res) => {
  try {
    const allRequests = await TitleSearchRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      allRequests,
    });
  } catch (err) {
    console.error("Fetching title search requests failed:", err);
    res.status(500).json({
      success: false,
      message: "Could not retrieve requests.",
    });
  }
});

module.exports = TitleSearchRouter;
