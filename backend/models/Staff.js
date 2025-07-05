const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "1234567890",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["appointment_manager", "verifier", "support", "staff"],
      default: "appointment_manager",
    },
    appointmentsHandled: [
      {
        appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Appointment",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
        },
      },
    ],
    verifiedProperties: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
        verificationDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
        },
      },
    ],
    // New Sales Target Management fields
    salesTargets: [
      {
        targetAmount: {
          type: Number,
          required: true,
        },
        achievedAmount: {
          type: Number,
          default: 0,
        },
        targetPeriod: {
          type: String,
          enum: ["monthly", "quarterly", "yearly"],
          required: true,
        },
        targetType: {
          type: String,
          enum: ["appointments", "properties", "revenue", "verifications"],
          required: true,
        },
        deadline: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["active", "completed", "overdue", "cancelled"],
          default: "active",
        },
        description: {
          type: String,
          trim: true,
        },
        notes: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
staffSchema.index({ staffId: 1 });
staffSchema.index({ email: 1 });
staffSchema.index({ role: 1 });
staffSchema.index({ "salesTargets.status": 1 });
staffSchema.index({ "salesTargets.deadline": 1 });

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;