const Joi = require("joi");

const authSchemas = {
  signUp: Joi.object({
    email: Joi.string().email().trim().required(),
    fullName: Joi.string().trim().min(2).max(24).required(),
    phone: Joi.string().trim().min(9).required(),
    password: Joi.string().trim().min(6).required(),
    firebaseToken: Joi.string().trim().optional().allow(""),
  }),
  verifyOtp: Joi.object({
    userId: Joi.string().required(),
    otp: Joi.string().trim().min(6).required(),
  }),
  resendOtp: Joi.object({
    email: Joi.string().trim().email().required(),
  }),
  login: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required(),
    firebaseToken: Joi.string().trim().optional().allow(""),
  }),
};

module.exports = {
  authSchemas,
};
