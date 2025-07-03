const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");

const SECRET = "bearer";

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ error: "Your authentication failed." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded Token:", decoded);
    // console.log("Decoded User adminID:", decoded.newUser.adminId);

    const user = await User.findById(decoded.id);
    // const admin = await Admin.findById({ adminId: decoded.newUser.adminId });
    const admin = await Admin.findById(decoded.id);
    const staff = await Staff.findById(decoded.id);

    console.log("User:", user);
    console.log("Admin:", admin);
    console.log("Staff:", staff);

    if (user) {
      req.userData = user;
      req.userType = user.isAdmin ? "admin" : "user";
    } else if (admin) {
      req.userData = admin;
      req.userType = "admin";
    } else if (staff) {
      req.userData = staff;
      req.userType = "staff";
    } else {
      return res
        .status(401)
        .json({ error: "User, Admin, or Staff not found." });
    }

    next();
  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).json({ error: "Your authentication failed." });
  }
};

// New /check-auth endpoint handler
const checkAuth = async (req, res) => {
  try {
    // The authenticate middleware will have set req.userData and req.userType
    if (req.userData && req.userType) {
      return res.status(200).json({
        ...req.userData.toJSON(), // Convert Mongoose document to plain object
        userType: req.userType,
      });
    }
    return res.status(401).json({ error: "No authenticated user found." });
  } catch (e) {
    console.error("Check-auth error:", e);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { authenticate, checkAuth };