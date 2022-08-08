var mongoose = require("mongoose");

var stockSchema = mongoose.Schema({
  mrp: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
  },
  moQty: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Stock", stockSchema);
