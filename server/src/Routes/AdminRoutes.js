const express = require("express");
const {
  getPrescriptionUploads,
  createOrderByAdmin,
} = require("../Controllers/AdminController");

const {
  isSignedIn,
  getUserById,
  isAuthenticated,
  checkUserRole,
} = require("../Controllers/UserController");

const router = express.Router();

router.param("userId", getUserById);


router.post(
  "/admin/createorder/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ORDER_ADMIN"),
  createOrderByAdmin
);

module.exports = router;
