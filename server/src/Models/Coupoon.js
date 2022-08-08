const mongoose = require("mongoose");
const coupoonSchema = mongoose.Schema(
  {
    users: [],
    reusable: { required: true, type: Boolean },
    desc: String,
    code: { required: true, type: String, unique: true },
    // 0=amt
    // 1=%
    discType: { type: Number, required: true },
    discAmt: { type: Number, required: true },
    maxDisc: { type: Number, default:0},
    //0=active
    //1=used
    //2=inactive
    status: { type: Number, default: 0 },
    order: [{ type:  mongoose.Schema.ObjectId, ref: "Order" }],
    validTill: { type: Date, required: true },
    minCartValue: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupoon", coupoonSchema);
