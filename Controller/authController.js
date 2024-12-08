const userRepo = require("../Repository/userRepo");
const registerValidation = require("../Validation/registerationValidation");
const loginValidation = require("../Validation/loginValidation");
const bcrypt = require("bcrypt");
const { generateToken } = require("../Middleware/token");

////////////////// Registration ////////////////////////

exports.userRegistration = async (req, res) => {
  try {
    if (req.body.password != req.body.confirmPassword) {
      return res.status(200).render("error", {
        message: "password is not equal to confirm password",
      });
    }
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(200).render("error", { message: error.message });
    }
    const exist = await userRepo.isMailExists(req.body.email);
    if (exist) {
      return res
        .status(200)
        .render("error", { message: "email Already Exists" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const userInfo = await userRepo.registerUser({
      ...req.body,
      password: hashPassword,
    });
    const token = generateToken({
      userId: userInfo._id,
      userEmail: userInfo.email,
    });
    res.cookie("jwt", token);
    return res.status(200).redirect(`/homePage`);
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

////////////////// login ////////////////////////

exports.userLogin = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(200).render("error", { message: error.message });
    }
    const exist = await userRepo.isMailExists(req.body.email);
    if (!exist) {
      return res.status(200).render("error", { message: "email Not Exists" });
    }
    const userInfo = await userRepo.userDetails(req.body.email);

    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      userInfo.password,
    );
    if (isCorrectPassword) {
      const token = generateToken({
        userId: userInfo._id,
        userEmail: userInfo.email,
      });
      res.cookie("jwt", token);
      return res.status(200).redirect(`/homePage`);
    } else {
      return res.status(200).render("error", { message: "incorrect password" });
    }
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};
