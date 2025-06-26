const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload files (works for any image including user profile image)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Supports images, videos, PDFs, etc.
    });

    console.log("File uploaded to Cloudinary:", response.url);

    // Delete the local file after upload
    try {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }

    return response; // Return Cloudinary response with image URL and public_id
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    try {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Failed to delete local file after error:", err);
    }
    return null;
  }
};

// Function to delete image from Cloudinary (for removing user profile images)
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deleted:", response);
    return response;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
