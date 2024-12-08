const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

router.use("/", authRoute);
router.use("/", productRoute);
router.use("/", cartRoute);
router.use("/", orderRoute);

module.exports = router;
