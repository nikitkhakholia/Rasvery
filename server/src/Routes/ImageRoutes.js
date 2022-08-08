const express = require("express");
const {
  uploadFile,
  getFile,
  multipleFileUpload,
  linkProductToFile,
} = require("../Controllers/ImageController");
const {
  isSignedIn,
  isAuthenticated,
  getUserById,
  checkUserRole,
} = require("../Controllers/UserController");

const router = express.Router();

router.param("userId", getUserById);
router.post("/upload/:userId", isSignedIn, isAuthenticated, uploadFile);
router.post(
  "/uploadMultiple/:userId",
  isSignedIn,
  isAuthenticated,
  multipleFileUpload
);
router.get("/filesync", getFile);
router.put(
  "/fileProducts/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  linkProductToFile
);

module.exports = router;
