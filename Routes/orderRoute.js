const express = require("express");
const router = express.Router();
const orderController = require("../Controller/orderController");
const { verifyToken } = require("../Middleware/token");

router.get("/getAllOrder", verifyToken, orderController.getAllOrder);
router.get("/addOrder", verifyToken, orderController.addOrder);
router.get("/deleteUserOrder", verifyToken, orderController.deleteUserOrder);
router.post(
  "/updateOrderStatus",
  verifyToken,
  orderController.updateOrderStatus,
);

module.exports = router;
