const cartModel = require("../Model/cartModel");

exports.addToCart = async (productId, userId) => {
  return await cartModel.create({ productId, userId });
};

exports.cartProduct = async (userId) => {
  return await cartModel.find({ userId });
};

exports.deleteCartProduct = async (productId) => {
  return await cartModel.deleteMany({ productId });
};

exports.isCartProductIdExists = async (productId) => {
  return await cartModel.countDocuments({ productId });
};

exports.isProductAlreadyAddedToCart = async (productId, userId) => {
  return await cartModel.countDocuments({ productId, userId });
};

exports.deleteUserCartProducts = async (userId) => {
  return await cartModel.deleteMany({ userId });
};
