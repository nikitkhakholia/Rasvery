const express = require("express");
const {
  getCategoryById,
  getCategory,
  getAllCategories,
  saveCategory,
} = require("../Controllers/CategoryController");
const {
  isSignedIn,
  isAuthenticated,
  checkUserRole,
  getUserById,
} = require("../Controllers/UserController");

const router = express.Router();

router.param("cateId", getCategoryById);
router.param("userId", getUserById);

router.get("/category/:cateId", getCategory);
router.get("/categories", getAllCategories);
router.post(
  "/category/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),

  saveCategory
);
// router.put("/category/:cateId", update);

module.exports = router;
