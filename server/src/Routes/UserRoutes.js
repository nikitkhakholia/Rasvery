const express = require("express");
const {
  getUserById,
  signUp,
  updateUser,
  signIn,
  checkNewEmailMobile,
  isSignedIn,
  isAuthenticated,
  userForgotPassword,
  addUserFCMTokens,
  getAllUsers,
  checkUserRole
} = require("../Controllers/UserController");
const router = express.Router();

router.param("userId", getUserById);

router.post("/checkNewEmailMobile", checkNewEmailMobile);
router.post("/user", signUp);
router.post("/signin", signIn);
router.put("/forgotPassword", userForgotPassword);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.post("/userFcmToken/:userId", isSignedIn, isAuthenticated, addUserFCMTokens);
router.get("/allusers/:userId", isSignedIn, isAuthenticated, checkUserRole("ROLE_ADMIN"), getAllUsers);

module.exports = router;
