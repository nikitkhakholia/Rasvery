const express = require("express");
const { getCategoryById } = require("../Controllers/CategoryController");
const {
  getSubCategoryById,
  getSubCategory,
  getAllSubCategoriesByCategoryId,
  saveSubCategory,
} = require("../Controllers/SubCategoryController");
const {
  getUserById,
  isSignedIn,
  isAuthenticated,
  checkUserRole,
} = require("../Controllers/UserController");
const router = express.Router();

router.param("scateId", getSubCategoryById);
router.param("userId", getUserById);
router.param("cateId", getCategoryById);

router.get("/subcategory/:scateId", getSubCategory);
router.get("/subcategories/:cateId", getAllSubCategoriesByCategoryId);
router.post(
  "/subcategory/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  saveSubCategory
);

module.exports = router;
