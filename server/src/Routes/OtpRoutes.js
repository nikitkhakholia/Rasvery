const express = require("express");
const { generateOtp, verifyOtp } = require("../Controllers/OtpController");

const router = express.Router();

router.get("/otp", generateOtp);
router.get("/votp", verifyOtp);

module.exports = router;
