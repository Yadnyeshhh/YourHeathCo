const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");




// Middleware to verify admin JWT token
const requireAdminAuth = async (req, res, next) => {
  // ✅ 1. Extract token from Authorization header
  const { authorization } = req.headers;
  // console.log("🔑 Incoming token header:", authorization);

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // Format: "Bearer <token>"
  const token = authorization.split(" ")[1];

  try {
    // ✅ 2. Verify token
    const { _id } = jwt.verify(token, process.env.SECRET);

    // ✅ 3. Attach admin to request (excluding password)
    req.admin = await Admin.findById(_id).select("-password -__v");

    if (!req.admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    next(); // ✅ move to next middleware or route handler
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Request not authorized" });
  }
};

module.exports = requireAdminAuth;
