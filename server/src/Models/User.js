var mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

var userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lname: {
      type: String,
      maxlength: 32,
      trim: true,
      default: "",
    },
    dob: {
      type: Date,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      trim: true,
      maxlength: 10,
      minlength: 10,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    encryPassword: {
      type: String,
      required: true,
    },
    salt: String,
    roles: [
      {
        type: String,
      },
    ],
    gstNo: {
      type: String,
      maxlength: 15,
      minlength: 15,
    },
    firebaseId: {
      type: String,
    },
    sessionId: {
      type: Number,
    },
    imageUrl: String,
    accessKey: String,
    lastLoginTime: Date,
    lastLoginDevice: String,
    files: [
      {
        type: Number,
        default: [],
        ref: "File",
      },
    ],
    address: [
      {
        default: Boolean,
        recieverName: String,
        line1: [String],
        pincode: { type: Number, maxlength: 6, minlength: 6, required: true },
        city: String,
        state: String,
        country: String,
        mobile: { type: Number, maxlength: 10, minlength: 10, required: true },
        email: String,
      },
    ],
    fcmTokens: [
      {
        dateCreated: { type: Date, default: Date.now() },
        token: { type: String },
      },
    ],
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encryPassword = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) == this.encryPassword;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      console.log("SECURE PASSWORD EXCEPTION: " + `${err}`);
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
