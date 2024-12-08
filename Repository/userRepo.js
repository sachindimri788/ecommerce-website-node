const userModel = require("../Model/userModel");

exports.registerUser = async (userData) => {
  return await userModel.create({
    ...userData,
    email: userData.email.toLowerCase(),
  });
};

exports.isMailExists = async (email) => {
  return await userModel.countDocuments({ email: email.toLowerCase() });
};

exports.userDetails = async (email) => {
  return await userModel.findOne({ email });
};
