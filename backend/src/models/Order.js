const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      house: { type: String, default: "" },
      street: { type: String, default: "" },
      locality: { type: String, default: "" },
      city: { type: String, default: "" },
      district: { type: String, default: "" },
      state: { type: String, default: "" },
      pin: { type: String, default: "" },
      landmark: { type: String, default: "" },
      instructions: { type: String, default: "" },
      notes: { type: String, default: "" },
      enquiryType: { type: String, default: "availability" },
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    source: {
      type: String,
      default: "whatsapp-enquiry",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
