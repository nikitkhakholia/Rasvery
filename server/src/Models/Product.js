var mongoose = require("mongoose");

var productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dsc: {
      type: String,
    },
    images: [],
    features: [String],
    tags: [String],
    stocks: [ { type: mongoose.Schema.ObjectId, required: true, ref: "Stock" }],
    disclaimer: String,
    subCategory: {
      type: Number,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    keyVal: [{ _id: false, key: String, value: String }],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);

