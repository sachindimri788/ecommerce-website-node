const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const productSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .pattern(/^\S.*$/),
  price: Joi.number().required(),
  image: Joi.string(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  token: Joi.string(),
  productId: JoiObjectId(),
});

module.exports = productSchema;
