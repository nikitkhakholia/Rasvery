const express = require("express");
const {
  getBanners,
  addBanner,
  getBannerById,
  deleteBanner,
} = require("../Controllers/BannerController");

const {
  isSignedIn,
  isAuthenticated,
  checkUserRole,
  getUserById,
} = require("../Controllers/UserController");

const router = express.Router();

router.param("userId", getUserById);

router.get("/banners/", getBanners);
router.post(
  "/banner/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  addBanner
);
router.delete(
  "/banner/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  deleteBanner
);

module.exports = router;
