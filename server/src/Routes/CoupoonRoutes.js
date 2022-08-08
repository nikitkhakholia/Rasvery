const express = require("express");
const {
  getCoupoonById,
  getCoupoon,
  getCoupoonByCode,
  saveCoupoon,
  updateCoupoon,
  getAllCoupoons,
  getAllCoupoonForUser,
} = require("../Controllers/CoupoonController");

const {
  isSignedIn,
  isAuthenticated,
  checkUserRole,
  getUserById,
} = require("../Controllers/UserController");

const router = express.Router();

router.param("cpnId", getCoupoonById);
router.param("userId", getUserById);
router.post(
  "/coupoon/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  saveCoupoon
);
router.get(
  "/allcoupoons/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  getAllCoupoons
);
router.get("/coupoons/:userId", isSignedIn, isAuthenticated, getAllCoupoonForUser)

module.exports = router;
