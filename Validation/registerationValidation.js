const Joi = require("joi");

const registrationValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^\S.*$/),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(4)
    .pattern(/^\S.*$/),
  confirmPassword: Joi.string()
    .required()
    .min(4)
    .pattern(/^\S.*$/),
});

module.exports = registrationValidation;
