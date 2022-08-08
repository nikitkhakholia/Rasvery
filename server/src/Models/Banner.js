var mongoose = require("mongoose");

var bannerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    required: true,
  },
  fileId: {
    type: Number,
    required: true,
  },
  toLink: "",
  products:[]
});

module.exports = mongoose.model("Banner", bannerSchema);
