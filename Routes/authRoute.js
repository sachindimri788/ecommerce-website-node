const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const { verifyToken } = require("../Middleware/token");

router.get("/", async (req, res) => {
  try {
    return res.status(200).render("login");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
});
router.get("/register", async (req, res) => {
  try {
    return res.status(200).render("register");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
});

router.post("/userRegistration", authController.userRegistration);
router.post("/userLogin", authController.userLogin);

router.get("/logout", verifyToken, (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
});

module.exports = router;
