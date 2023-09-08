import Joi from "joi";
import { AppError } from "../../utils/error/appError.js";

export const mainValidationSchema = {
  firstName: Joi.string().min(2).max(16).required().messages({
    "string.empty": `firstName cannot be an empty field`,
    "string.min": "firstName must be at least 2 characters long",
    "string.max": "firstName cannot be more than 16 characters long",
    "any.required": "firstName is required",
  }),
  lastName: Joi.string().min(2).max(16).required().messages({
    "string.empty": `lastName cannot be an empty field`,
    "string.min": "lastName must be at least 2 characters long",
    "string.max": "lastName cannot be more than 16 characters long",
    "any.required": "lastName is required",
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.empty": `Email cannot be an empty field`,
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .required()
    .messages({
      "string.empty": `Password cannot be an empty field`,
      "string.pattern.base": "Password must contain only letters and numbers",
      "any.required": "Password is required",
    }),
  repeatPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": `Repeat password cannot be an empty field`,
    "any.only": "Repeat password must match the password",
    "any.required": "Password is required",
  }),
  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .message({
      "string.pattern.base": "Only Egyptian phone numbers are allowed",
    }),
  token: Joi.string()
    .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    .message({
      "string.empty": `The URL missing a token`,
      "string.pattern.base": "The token formate is invalid",
    }),
  code: Joi.string().length(6).hex().required(),
  name: Joi.string().min(2).max(16).required().messages({
    "string.empty": `firstName cannot be an empty field`,
    "string.min": "firstName must be at least 2 characters long",
    "string.max": "firstName cannot be more than 16 characters long",
    "any.required": "firstName is required",
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const reqData = { ...req.body, ...req.params, ...req.query };

    const { error } = schema.validate(reqData, { abortEarly: false });

    if (error) {
      const message = error.details.map((err) => err.message);
      return next(new AppError(message, 400));
    }

    next();
  };
};
