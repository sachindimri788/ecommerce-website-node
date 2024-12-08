require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        res.status(403).render("login", {
          message: "Authentication failed",
        });
      } else {
        const userId = decoded?.user.userId;
        const userEmail = decoded?.user.userEmail;
        res.locals.userId = userId;
        res.locals.userEmail = userEmail;
        next();
      }
    });
  } else {
    res.status(403).render("login", {
      message: "Authentication failed",
    });
  }
};

const generateToken = (user) => {
  const payload = { user };
  return jwt.sign(payload, secretKey);
};

module.exports = { verifyToken, generateToken };
