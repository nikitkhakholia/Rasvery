const express = require("express");
const {
  getOrderById,
  getOrdersByUser,
  saveOrder,
  updateOrder,
  getOrdersForAdmin,
  userUpdatesOrder,
} = require("../Controllers/OrderController");
const {
  getUserById,
  isSignedIn,
  isAuthenticated,
  checkUserRole,
} = require("../Controllers/UserController");
const router = express.Router();

router.param("oId", getOrderById);
router.param("userId", getUserById);

// router.get("/order/:oId", getOrder);
router.get("/orderbyuser/:userId", getOrdersByUser);


router.post(
  "/order/:userId",
  isSignedIn,
  isAuthenticated,
  saveOrder
);
router.put(
  "/order/:userId/:oId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ORDER_ADMIN"),
  updateOrder
);
router.put(
  "/orderu/:userId/:oId",
  isSignedIn,
  isAuthenticated,
  userUpdatesOrder
);
router.get(
  "/orders/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ORDER_ADMIN"),
  getOrdersForAdmin
);

module.exports = router;
