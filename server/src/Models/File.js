var mongoose = require("mongoose");

var fileSchema = mongoose.Schema(
  {
    path: {
      type: String,
    },
    fileType: {
      type: String,
    },
    for: {
      type: String,
    },
    forId: String,
    dsc: String,
    name: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("File", fileSchema);
