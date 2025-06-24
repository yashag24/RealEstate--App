const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: "dsrbflu0a",
  api_key: "425673899486623",
  api_secret: "Xp4012GXyXc3NEawuQnqOUx_SfM",
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
