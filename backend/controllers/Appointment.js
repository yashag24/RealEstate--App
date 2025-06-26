const express = require("express");
const router = express.Router();
const Appointments = require("../models/Appointment");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

// Guest route - no authentication required
router.post("/appointments/admin", async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all required fields: firstName, lastName, email, and phone",
    });
  }

  const appointment = new Appointments({
    firstName,
    lastName,
    email,
    phoneNumber: phone,
    isGuest: true,
  });

  try {
    await appointment.save();
    return res.status(200).json({
      success: true,
      message: "Guest appointment sent to admin!",
    });
  } catch (error) {
    console.error("Error saving guest appointment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Logged-in user route
router.post("/appointments/user", authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const userId = req.user._id;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: firstName, lastName, email, and phone",
      });
    }

    const appointment = new Appointments({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      userId,
      isGuest: false,
    });

    await appointment.save();
    return res.status(200).json({
      success: true,
      message: "User appointment booked successfully!",
    });
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get appointments - Admin gets all, user gets their own
// Get appointments - Always fetch all appointments
router.get("/appointments", authenticate, async (req, res) => {
  try {
    const appointments = await Appointments.find()
      .populate("userId")
      .populate("staffId");

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Delete appointment (User can delete their own or admin can delete any)
router.delete("/appointments/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointments.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      !req.admin &&
      appointment.userId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this appointment",
      });
    }

    await Appointments.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
