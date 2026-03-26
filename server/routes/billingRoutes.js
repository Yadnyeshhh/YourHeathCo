const express = require("express");
const router = express.Router();

const {
  createBill,
  getAllBills,
  getUserBills,
  getBillByInvoiceId,
  updateBillStatus,
  deleteBill,
} = require("../controllers/billingController");

const requireAdminAuth = require("../middleware/requireAdminAuth");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

// Hybrid middleware to allow both authenticated users and admins
const authOrAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Authorization token required" });
  
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(_id).select("_id email name");
    if (user) {
      req.user = user;
      return next();
    }
    const admin = await Admin.findById(_id).select("-password -__v");
    if (admin) {
      req.admin = admin;
      return next();
    }
    return res.status(401).json({ error: "User or Admin not found" });
  } catch (error) {
    return res.status(401).json({ error: "Request not authorized" });
  }
};

// -------------------- Routes --------------------

// Admin routes
router.post("/create", requireAdminAuth, createBill);
router.get("/all", requireAdminAuth, getAllBills);
router.patch("/status/:invoiceId", requireAdminAuth, updateBillStatus);
router.delete("/:invoiceId", requireAdminAuth, deleteBill);

// Shared Admin/User routes
router.get("/user/:userId", authOrAdmin, getUserBills);
router.get("/:invoiceId", authOrAdmin, getBillByInvoiceId);

module.exports = router;
