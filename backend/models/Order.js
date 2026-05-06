const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        id: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        size: { type: String },
      },
    ],
    total: { type: Number, required: true },
    payment: { type: String, required: true },
    status: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      altPhone: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
