var mongoose = require("mongoose");

var otpSchema = mongoose.Schema({
  to: String,
  otp: Number,
  expiresOn: {
    type: Date,
    default: +new Date() + 84600000,
  },
});
module.exports = mongoose.model("Otp", otpSchema);
