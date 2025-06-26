const express = require("express");
const cors = require('cors');
const router = express.Router();
const jwt = require("jsonwebtoken");
const EmailVerify = require("../models/emailVerification");
const { generateOTP, sendOTP } = require("../util/otp");
const SECRET_KEY = "123456";

router.post("/generate-otp", async (req, res) => {
  const email = req.body.email;

  try {
    let user = await EmailVerify.findOne({ email: email });
    if (!user) {
      user = new EmailVerify({ email: email });
    }

    // If user is blocked, return an error
    if (user.isBlocked) {
      const currentTime = new Date();
      if (currentTime < user.blockUntil) {
        return res.status(403).send("Account blocked. Try after some time.");
      } else {
        user.isBlocked = false;
        user.OTPAttempts = 0;
      }
    }

    // Check for minimum 1-minute gap between OTP requests
    const lastOTPTime = user.OTPCreatedTime;
    const currentTime = new Date();

    if (lastOTPTime && currentTime - lastOTPTime < 60000) {
      return res
        .status(403)
        .send("Minimum 1-minute gap required between OTP requests");
    }

    const OTP = generateOTP();
    user.OTP = OTP;
    user.OTPCreatedTime = currentTime;

    await user.save();

    sendOTP(email, OTP);

    res.status(200).send("OTP sent successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.post("/emailLogin", async (req, res) => {
  const email = req.body.email;
  const OTP = req.body.OTP;

  try {
    const user = await EmailVerify.findOne({ email: email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if user account is blocked
    if (user.isBlocked) {
      const currentTime = new Date();
      if (currentTime < user.blockUntil) {
        return res.status(403).send("Account blocked. Try after some time.");
      } else {
        user.isBlocked = false;
        user.OTPAttempts = 0;
      }
    }

    // Check OTP
    if (user.OTP !== OTP) {
      user.OTPAttempts++;

      // If OTP attempts >= 5, block user for 1 hour
      if (user.OTPAttempts >= 5) {
        user.isBlocked = true;
        let blockUntil = new Date();
        blockUntil.setHours(blockUntil.getHours() + 1);
        user.blockUntil = blockUntil;
      }

      await user.save();

      return res.status(403).send("Invalid OTP");
    }

    // Check if OTP is within 1hr
    const OTPCreatedTime = user.OTPCreatedTime;
    const currentTime = new Date();

    if (currentTime - OTPCreatedTime > 60 * 60 * 1000) {
      return res.status(403).send("OTP expired");
    }

    // Generate JWT
    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Clear OTP
    user.OTP = undefined;
    user.OTPCreatedTime = undefined;
    user.OTPAttempts = 0;

    await user.save();
    res.json({ token });
    console.log("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error123");
  }
});

module.exports = router;
