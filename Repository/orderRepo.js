const orderModel = require("../Model/orderModel");

exports.addProductToOrder = async (cartProductsIdAndUserId) => {
  return await orderModel.insertMany(cartProductsIdAndUserId);
};

exports.getAllOrder = async (userId) => {
  return await orderModel.find({ userId });
};

exports.deleteUserOrderProducts = async (userId) => {
  return await orderModel.deleteMany({ userId });
};

exports.getAllOrderProducts = async (userId) => {
  return await orderModel.find({ userId }).populate("productId");
};

exports.isOrderIdExists = async (orderId) => {
  return await orderModel.countDocuments({ _id: orderId });
};

exports.updateOrderStatus = async (orderId, status) => {
  return await orderModel.updateOne({ _id: orderId }, { $set: { status } });
};
