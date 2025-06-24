const express = require("express");
const router = express.Router();
const multer = require("multer");

const PropertyImage = require("../models/propertyImage");

const storage = multer.memoryStorage(); // Use memory storage or configure as needed
const upload = multer({ storage });

// Create Property Image
router.post("/property-image", upload.single("image_url"), async (req, res) => {
  try {
    console.log("came here");
    const { property_id } = req.body;
    const image_url = req.file.buffer; // Handle the image buffer

    const newPropertyImage = new PropertyImage({ property_id, image_url });
    await newPropertyImage.save();

    console.log("Successfull");
    res.status(201).json(newPropertyImage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Property Images
router.get("/property-image", async (req, res) => {
  try {
    const propertyImages = await PropertyImage.find();
    res.json(propertyImages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Property Image
router.delete("/property-image/:propertyImage_id", async (req, res) => {
  const { propertyImage_id } = req.params;
  try {
    const propertyImage = await PropertyImage.findById(propertyImage_id);
    if (!propertyImage) {
      return res.status(404).json({ error: "Property Image not found" });
    }
    await PropertyImage.findByIdAndDelete(propertyImage_id);
    res.json({ message: "Property Image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Property Image
router.put("/property-image/:propertyImage_id", async (req, res) => {
  const { propertyImage_id } = req.params;
  try {
    let propertyImage = await PropertyImage.findById(propertyImage_id);
    if (!propertyImage) {
      return res.status(404).json({ error: "Property Image not found" });
    }
    propertyImage = await PropertyImage.findByIdAndUpdate(propertyImage_id, req.body, { new: true });
    res.json(propertyImage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;