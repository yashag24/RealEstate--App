const mongoose = require("mongoose");

const propertyImageSchema = new mongoose.Schema({
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  image_url: { type: String, required: true },
});

const PropertyImage = mongoose.model("PropertyImage", propertyImageSchema);

module.exports = PropertyImage;
