const express = require("express");
const router = express.Router();

const productController = require("../Controller/productController");
const { verifyToken } = require("../Middleware/token");

router.get("/homePage", verifyToken, productController.homePage);

router.post("/addProduct", verifyToken, productController.addProduct);

router.get("/viewProduct", verifyToken, productController.viewProduct);

router.post(
  "/getUpdateProduct",
  verifyToken,
  productController.getUpdateProduct,
);

router.post("/updateProduct", verifyToken, productController.updateProduct);

router.post("/deleteProduct", verifyToken, productController.deleteProduct);

router.get(
  "/searchProductName",
  verifyToken,
  productController.searchProductName,
);

router.get("/categorySearch", verifyToken, productController.categorySearch);

module.exports = router;
