const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    fullName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    email: { type: String, required: false },

    buyersId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    sellersId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
