const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    weight: {
      type: String, // "500g"
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("CartItem", cartItemSchema);