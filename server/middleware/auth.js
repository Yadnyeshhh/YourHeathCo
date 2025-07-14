const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

const authmiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    // Optional: fetch user from DB to validate
    const user = await User.findById(decoded._id).select("_id email");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // now has full user data
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authmiddleware;
