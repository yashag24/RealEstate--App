const express = require("express");
const Testimonial = require("../models/Testimonial");

const router = express.Router();

// Get all testimonials GET http://localhost:5000/testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get a testimonial by ID GET http://localhost:5000/testimonials/id
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).send("Testimonial not found");
    res.json(testimonial);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a new testimonial POST http://localhost:5000/testimonials
router.post("/", async (req, res) => {
  try {
    const newTestimonial = new Testimonial({
      author: req.body.author,
      content: req.body.content,
      title: req.body.title
    });
    const testimonial = await newTestimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update a testimonial by ID PUT http://localhost:5000/testimonials/id
router.put("/:id", async (req, res) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).send("Testimonial not found");
    newTestimonial = {};
    if (req.body.author) newTestimonial.author = req.body.author;
    if (req.body.content) newTestimonial.content = req.body.content;
    if (req.body.rating) newTestimonial.rating = req.body.rating;
    await console.log(newTestimonial);
    testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: newTestimonial },
      { new: true }
    );

    res.json(testimonial);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete a testimonial by ID DELETE http://localhost:5000/testimonials/id
router.delete("/:id", async (req, res) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).send("Testimonial not found");

    testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    res.json({
      testimonial: testimonial,
      success: "Testimonial deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
