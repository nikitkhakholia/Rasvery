const express = require("express");
const {
  getProductById,
  getProduct,
  getProductsBySubCategory,
  saveProduct,
  updateProduct,
  getProducts,
  addStock,
  updateStock,
  getProductsNames,
} = require("../Controllers/ProductController");
const { getSubCategoryById } = require("../Controllers/SubCategoryController");
const {
  isSignedIn,
  isAuthenticated,
  getUserById,
  checkUserRole,
} = require("../Controllers/UserController");
const router = express.Router();

router.param("scateId", getSubCategoryById);
router.param("userId", getUserById);
router.param("productId", getProductById);

router.get("/product/:productId", getProduct);
router.get("/productsbysubcategory/:scateId", getProductsBySubCategory);
router.post(
  "/product/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  saveProduct
);
router.put(
  "/product/:userId/:productId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  updateProduct
);
router.get("/products", getProducts);
router.get("/productsnames", getProductsNames);
router.post(
  "/stock/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  addStock
);
router.put(
  "/stock/:userId",
  isSignedIn,
  isAuthenticated,
  checkUserRole("ROLE_ADMIN"),
  updateStock
);

module.exports = router;
