const express = require("express");
const router = express.Router();
const cartController = require("../Controller/cartController");
const { verifyToken } = require("../Middleware/token");

router.post("/addToCart", verifyToken, cartController.addToCart);
router.get("/getCartProduct", verifyToken, cartController.getCartProduct);
router.post(
  "/deleteCartProduct",
  verifyToken,
  cartController.deleteCartProduct,
);

module.exports = router;
