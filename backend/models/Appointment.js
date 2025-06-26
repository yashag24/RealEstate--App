const mongoose = require("mongoose");

const UpdateLogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
        "No-show",
      ],
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ["Site Visit", "Consultation", "Document Collection", "Other"],
    },
    staffId: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
    note: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const AppointmentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
        "No-show",
      ],
      default: "Pending",
    },
    appointmentUpdates: [UpdateLogSchema],
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
