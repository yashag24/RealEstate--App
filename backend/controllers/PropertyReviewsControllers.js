const express = require("express");
const PropertyReviewRouter = express.Router();
const PropertyReview = require("../models/PropertyReviews.js");

// add reviews
PropertyReviewRouter.post("/add-property-review", async (req, res) => {
  try {
    const { name, review, rating, propertyId } = req.body;

    if (
      !name ||
      !review ||
      !propertyId ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields including a valid rating (1-5) are required.",
      });
    }

    let propertyReview = await PropertyReview.findOne({ propertyId });

    if (propertyReview) {
      propertyReview.reviews.unshift({
        name,
        comment: review,
        rating,
        timestamp: new Date(),
      });

      await propertyReview.save();
    } else {
      propertyReview = new PropertyReview({
        propertyId,
        reviews: [
          {
            name,
            comment: review,
            rating,
            timestamp: new Date(),
          },
        ],
      });

      await propertyReview.save();
    }

    res
      .status(201)
      .json({ success: true, message: "Review added successfully." });
  } catch (error) {
    console.error("Error creating property review:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// get all review for admin
PropertyReviewRouter.get("/get-all-reviews", async (req, res) => {
  try {
    const reviews = await PropertyReview.find().populate("propertyId");

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching all property reviews:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// get review of single property
PropertyReviewRouter.post("/single-property-reviews", async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: true,
        message: "Property id required",
      });
    }

    const findPropertyReview = await PropertyReview.findOne({
      propertyId: propertyId,
    });

    if (!findPropertyReview) {
      return res.json({
        success: false,
        message: "review no for this property",
      });
    }

    return res.json({
      success: true,
      message: "data fetch successfully",
      reviews: findPropertyReview.reviews,
    });
  } catch (error) {
    console.error("Error fetching single property reviews:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = PropertyReviewRouter;
