const express = require("express");
const {
  getCartItemsByUser,
  saveCartItem,
  updateCartItem,
} = require("../Controllers/CartItemController");
const {
  isSignedIn,
  isAuthenticated,
  getUserById,
} = require("../Controllers/UserController");
const router = express.Router();

router.param("userId", getUserById);

router.get(
  "/cartitems/:userId",
  isSignedIn,
  isAuthenticated,
  getCartItemsByUser
);
router.post("/cartitem/:userId", isSignedIn, isAuthenticated, saveCartItem);
router.put("/cartitem/:userId", isSignedIn, isAuthenticated, updateCartItem);

module.exports = router;
