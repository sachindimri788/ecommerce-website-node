const orderRepo = require("../Repository/orderRepo");
const userRepo = require("../Repository/userRepo");
const cartRepo = require("../Repository/cartRepo");

exports.getAllOrder = async (req, res) => {
  try {
    const userInfo = await userRepo.userDetails(res.locals.userEmail);
    const orderProducts = await orderRepo.getAllOrderProducts(
      res.locals.userId,
    );
    const productSelectedInfo = orderProducts.map((product) => ({
      orderId: product._id,
      name: product.productId?.name || "Product Removed by User",
      price: product.productId?.price || 0,
      description: product.productId?.description,
      category: product.productId?.category,
      image: product.productId?.image,
      time: product.createdAt.toLocaleString(),
      status: product.status,
    }));
    if (req.query.order === "openOrderTrack") {
      return res.status(200).render("orderTrack", {
        userProductInfo: productSelectedInfo,
        userName: userInfo.name,
        message: req.query.message,
      });
    }
    return res.status(200).render("orderHistory", {
      userProductInfo: productSelectedInfo,
      userName: userInfo.name,
      message: req.query.message,
    });
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const cartProducts = await cartRepo.cartProduct(res.locals.userId);
    const cartProductsIdAndUserId = cartProducts.map((product) => ({
      productId: product.productId,
      userId: res.locals.userId,
    }));
    await orderRepo.addProductToOrder(cartProductsIdAndUserId);
    await cartRepo.deleteUserCartProducts(res.locals.userId);
    return res
      .status(200)
      .redirect("getAllOrder?message=Order Placed! ThankYou!!");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.deleteUserOrder = async (req, res) => {
  try {
    await orderRepo.deleteUserOrderProducts(res.locals.userId);
    return res.status(200).redirect("getAllOrder");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!(await orderRepo.isOrderIdExists(req.body.orderId))) {
      return res
        .status(200)
        .render("error", { message: "Order is Not Exists" });
    }
    await orderRepo.updateOrderStatus(req.body.orderId, req.body.status);
    return res.status(200).redirect("getAllOrder");
  } catch (error) {
    return res
      .status(500)
      .render("error", { message: "internal server error" });
  }
};
