const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");

const SECRET = "bearer";

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).send({ error: "Your authentication failed." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded._id || decoded.id);
    const admin = await Admin.findOne({ adminId: decoded.adminId });
    const staff = await Staff.findOne({ staffId: decoded.staffId });

    if (user) {
      req.user = user;
      if (user.isAdmin) {
        req.admin = user;
      }
    } else if (admin) {
      req.admin = admin;
    } else if (staff) {
      req.staff = staff;
    } else {
      return res
        .status(401)
        .send({ error: "User, Admin, or Staff not found." });
    }

    next();
  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).send({ error: "Your authentication failed." });
  }
};

const authorizeAdmin = async (req, res, next) => {
  if (!req.admin) {
    return res.status(403).send({ error: "Access denied. Admins only." });
  }

  next();
};

module.exports = { authenticate, authorizeAdmin };
