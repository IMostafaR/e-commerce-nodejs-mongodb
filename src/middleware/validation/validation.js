import Joi from "joi";
import { AppError } from "../../utils/error/appError.js";

export const mainValidationSchema = {
  firstName: Joi.string().min(2).max(16).required().message({
    "string.min": "firstName must be at least 2 characters long",
    "string.max": "firstName cannot be more than 16 characters long",
    "any.required": "firstName is required",
  }),
  lastName: Joi.string().min(2).max(16).required().message({
    "string.min": "lastName must be at least 2 characters long",
    "string.max": "lastName cannot be more than 16 characters long",
    "any.required": "lastName is required",
  }),
  email: Joi.string().email({ minDomainSegments: 3 }).required().message({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
    .message({
      "string.pattern.base": "Password must contain only letters and numbers",
      "any.required": "Password is required",
    }),
  repeatPassword: Joi.string().valid(Joi.ref("password")).required().message({
    "any.only": "Repeat password must match the password",
    "any.required": "Repeat password is required",
  }),
  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .message({
      "string.pattern.base": "Only Egyptian phone numbers are allowed",
    }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const reqData = { ...req.body, ...req.params, ...req.query };

    const { error } = schema.validate(reqData, { abortEarly: false });

    if (error) {
      const message = error.details.map((err) => err.message);
      return new AppError(message, 400);
    }

    next();
  };
};
