const Joi = require("joi");

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(4)
    .pattern(/^\S.*$/),
});

module.exports = loginValidation;
