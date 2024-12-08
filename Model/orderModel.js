const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["delivered", "pending", "reject", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
