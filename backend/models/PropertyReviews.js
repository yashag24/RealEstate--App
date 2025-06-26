const mongoose = require("mongoose");

const PropertyReviewsSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const PropertyReview = mongoose.model("PropertyReview", PropertyReviewsSchema);

module.exports = PropertyReview;
