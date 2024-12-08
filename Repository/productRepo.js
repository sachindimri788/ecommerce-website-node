const productModel = require("../Model/productModel");

exports.addProduct = async (productData) => {
  return await productModel.create(productData);
};

exports.userProduct = async (userId, pageNo = 1, limit) => {
  return await productModel
    .find({ userId })
    .skip((pageNo - 1) * limit)
    .limit(limit);
};

exports.productByProductId = async (productId) => {
  return await productModel.findOne({ _id: productId });
};

exports.updateProduct = async (product, _id) => {
  return await productModel.updateOne({ _id }, { $set: product });
};

exports.deleteProduct = async (_id) => {
  return await productModel.deleteOne({ _id });
};

exports.isProductIdExist = async (_id) => {
  return await productModel.countDocuments({ _id });
};

exports.checkIfProductNameExists = async (name) => {
  return await productModel.countDocuments({ name });
};

exports.searchUserProduct = async (productName, userId) => {
  const searchProductName = new RegExp(productName, "i"); // 'i' for case-insensitive matching
  return await productModel.find({
    $or: [{ name: searchProductName }],
    userId,
  });
};

exports.searchUserProductCategory = async (category, userId) => {
  return await productModel.find({ category, userId });
};

exports.findProductByIds = async (productIds) => {
  return await productModel.find({ _id: { $in: productIds } });
};

exports.countTotalProduct = async (userId) => {
  return await productModel.countDocuments({ userId });
};
