const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    featured: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    points: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    isKit: {
      type: Boolean,
      default: false,
    },
    includedProducts: {
      type: [Number],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 20,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
