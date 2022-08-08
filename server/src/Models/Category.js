var mongoose = require("mongoose");

var cateSchema = mongoose.Schema(
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
    subCategories: [
      {
        type: Number,
        default: [],
        ref: "SubCategory",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", cateSchema);
