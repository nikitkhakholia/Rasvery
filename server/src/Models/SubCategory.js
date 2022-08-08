var mongoose = require("mongoose");

var sCateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },

    dsc: {
      type: String,
      maxlength: 100,
      default: "",
    },
    imageId: {
      type: Number,
    },
    category: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", sCateSchema);
