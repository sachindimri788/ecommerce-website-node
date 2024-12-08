const cartRepo = require("../Repository/cartRepo");
const productRepo = require("../Repository/productRepo");
const userRepo = require("../Repository/userRepo");

exports.addToCart = async (req, res) => {
  try {
    if (!req.query.productId) {
      return res
        .status(500)
        .render("error", { message: "productId not Found" });
    }
    const isProductIdExist = await productRepo.isProductIdExist(
      req.query.productId,
    );
    if (!isProductIdExist) {
      return res.status(200).render("error", { message: "invalid Product" });
    }
    if (
      await cartRepo.isProductAlreadyAddedToCart(
        req.query.productId,
        res.locals.userId,
      )
    ) {
      return res
        .status(200)
        .redirect("viewProduct?addToCartMessage=Already added to Cart");
    }
    await cartRepo.addToCart(req.query.productId, res.locals.userId);
    return res
      .status(200)
      .redirect("viewProduct?addToCartMessage=Successfully added to Cart");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.getCartProduct = async (req, res) => {
  try {
    const cart = await cartRepo.cartProduct(res.locals.userId);
    const userInfo = await userRepo.userDetails(res.locals.userEmail);
    const productIds = cart.map((item) => item.productId);
    const cartProductDetails = await productRepo.findProductByIds(productIds);
    let Total_Amount = 0;
    const userProductInfo = cartProductDetails.map((product) => {
      Total_Amount = Total_Amount + product.price;
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
      };
    });
    return res.status(200).render("cartProduct", {
      userName: userInfo.name,
      userProductInfo,
      Total_Amount,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.deleteCartProduct = async (req, res) => {
  try {
    if (!req.query.productId) {
      return res
        .status(200)
        .render("error", { message: "prouductId not Found" });
    }
    if (!(await cartRepo.isCartProductIdExists(req.query.productId))) {
      return res
        .status(500)
        .render("error", { message: "Product already Removed" });
    }
    await cartRepo.deleteCartProduct(req.query.productId);
    return res.status(200).redirect("getCartProduct");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};
