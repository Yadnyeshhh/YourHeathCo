const Billing = require("../models/billingModel");

// Create a new bill (Admin/User)
const createBill = async (req, res) => {
  try {
    const {
      invoiceId,
      userId,
      date,
      amount,
      status,
      category,
      doctor,
      hospital,
      items,
      images,
    } = req.body;

    const newBill = await Billing.create({
      invoiceId,
      userId,
      date,
      amount,
      status,
      category,
      doctor,
      hospital,
      items,
      images,
    });

    res.status(201).json(newBill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bills (Admin only)
const getAllBills = async (req, res) => {
  try {
    const bills = await Billing.find().populate("userId", "name email");
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};

// Get user specific bills
const getUserBills = async (req, res) => {
  const { userId } = req.params;

  // Check if req.user is accessing their own bills, or if it's an admin
  if (req.user && req.user._id.toString() !== userId && !req.admin) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const bills = await Billing.find({ userId }).sort({ createdAt: -1 });
    
    // If the user has no bills, return a default structure with 0 amount
    if (bills.length === 0) {
      return res.status(200).json([
        {
          _id: "default-000",
          invoiceId: "INV-DEFAULT",
          userId: userId,
          date: new Date(),
          amount: 0,
          status: "Pending",
          category: "General",
          doctor: "N/A",
          hospital: "N/A",
          items: [],
          images: [],
        }
      ]);
    }

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user bills" });
  }
};

// Get bill by invoiceId
const getBillByInvoiceId = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const bill = await Billing.findOne({ invoiceId }).populate("userId", "name email");
    
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    // Check authorization: Admin has full access, User can only access their own bill
    if (req.user && bill.userId._id.toString() !== req.user._id.toString() && !req.admin) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bill" });
  }
};

// Update bill status (Admin)
const updateBillStatus = async (req, res) => {
  const { invoiceId } = req.params;
  const { status } = req.body;

  try {
    const bill = await Billing.findOneAndUpdate(
      { invoiceId },
      { status },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ error: "Failed to update bill status" });
  }
};

// Delete bill (Admin)
const deleteBill = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const bill = await Billing.findOneAndDelete({ invoiceId });

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bill" });
  }
};

module.exports = {
  createBill,
  getAllBills,
  getUserBills,
  getBillByInvoiceId,
  updateBillStatus,
  deleteBill,
};
