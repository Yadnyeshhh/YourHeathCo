// middleware/auth.js — Unified JWT verification for patients and admins
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

// Unified auth middleware
const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Auth payload:', payload);
    const id = payload.id || payload._id;
    const role = payload.role;
    req.auth = { id, role };

    // Load the full document for convenience if needed
    if (role === "patient") {
      req.user = await User.findById(id).select("_id email name");
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found or token invalid" });
      }
    } else if (role === "admin") {
      req.admin = await Admin.findById(id).select("-password -__v");
      if (!req.admin) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Admin not found or token invalid",
          });
      }
    }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Request not authorized" });
  }
};

module.exports = auth;
