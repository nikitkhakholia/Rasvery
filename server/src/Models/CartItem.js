var mongoose = require("mongoose");

var cartItemSchema = mongoose.Schema(
  {
    user: { type: Number, required: true },
    product: { type: mongoose.Schema.ObjectId, required: true, ref: "Product" },
    stock: { type: mongoose.Schema.ObjectId, required: true, ref: "Stock" },
    qty: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", cartItemSchema);
