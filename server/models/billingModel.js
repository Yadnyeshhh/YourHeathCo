const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    category: { type: String },
    doctor: { type: String },
    hospital: { type: String },
    items: [
      {
        label: String,
        amount: Number,
      },
    ],
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Billing || mongoose.model("Billing", billingSchema);
