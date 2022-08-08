const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: {
    name: {
      type: String,
      required: true,
    },
    dsc: {
      type: String,
      default: "",
    },
    images: [],
    features: [String],
    tags: [String],
    stocks: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
          required: true,
        },
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
      },
    ],
    disclaimer: String,
    subCategory: {
      type: Number,
      // required: true,
    },
    category: {
      type: Number,
      // required: true,
    },
    keyVal: [{ _id: false, key: String, value: String }],
  },
  qty: { type: Number, required: true },
});

const orderSchema = mongoose.Schema(
  {
    items: [orderItemSchema],
    //0=Placed
    //1=Accepted
    //2=Confirmed(UserAccepted)
    //3=Packed
    //4=Shipped
    //5=OutForDelivery
    //6=Delivered
    //7=ReturnRequested
    //8=Returned
    //9=Refunded
    //10=Cancelled

    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      default: 0,
    },
    statusLastUpdatedBy: String,
    user: { type: Number, required: true },
    userAccepted: Number,

    note: String,

    subTotal: { type: Number, required: true },
    shippingCharges: { type: Number, required: true },
    coupoonDiscount: { type: Number, default: 0 },
    coupoon: { type: mongoose.ObjectId, ref: "Coupoon" },
    netAmount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    razorpayOrderId: String,
    paymentId: String,
    razorpayPaymentSignature: String,
    paymentStatus: { type: Number, default: 0 },
    paymentUpdatedBy: String,

    courierPartner: { type: String, default: "" },
    trackingId: { type: String, default: "" },
    billingAddress: {
      receiverName: String,
      line1: [String],
      pincode: { type: Number, maxlength: 6, minlength: 6 },
      city: String,
      state: String,
      country: String,
      mobile: { type: Number, maxlength: 10, minlength: 10 },
      email: String,
    },
    shippingAddress: {
      receiverName: String,
      line1: [String],
      pincode: { type: Number, required: true, maxlength: 6, minlength: 6 },
      city: String,
      state: String,
      country: String,
      mobile: { type: Number, maxlength: 10, minlength: 10, required: true },
      email: String,
    },

    deliveryPartner: String,
    deliveryPersonName: String,
    deliveryPersonMobile: String,
    deliveryPersonUserId: String,

    returnNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
