const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const requireAdminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    // Verify admin exists
    const admin = await Admin.findById(decoded._id).select("_id email");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin; // attach admin info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = requireAdminAuth;
