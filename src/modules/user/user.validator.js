import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createUserValidation = Joi.object({
  firstName: mainValidationSchema.firstName,
  lastName: mainValidationSchema.lastName,
  email: mainValidationSchema.email,
  password: mainValidationSchema.password,
  repeatPassword: mainValidationSchema.repeatPassword,
  role: Joi.string().valid("admin", "user").required().messages({
    "string.empty": `role cannot be an empty field`,
    "any.only": "role must be admin or customer",
    "any.required": "role is required",
  }),
  verifiedEmail: Joi.boolean().valid(true).required().messages({
    "boolean.base": "verifiedEmail must be true",
    "any.required": "verifiedEmail is required",
  }),
});

const updateUserValidation = Joi.object({
  id: mainValidationSchema.id,
  firstName: Joi.string().min(2).max(16).messages({
    "string.empty": `firstName cannot be an empty field`,
    "string.min": "firstName must be at least 2 characters long",
    "string.max": "firstName cannot be more than 16 characters long",
    "any.required": "firstName is required",
  }),
  lastName: Joi.string().min(2).max(16).messages({
    "string.empty": `lastName cannot be an empty field`,
    "string.min": "lastName must be at least 2 characters long",
    "string.max": "lastName cannot be more than 16 characters long",
    "any.required": "lastName is required",
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).messages({
    "string.empty": `Email cannot be an empty field`,
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .messages({
      "string.empty": `Password cannot be an empty field`,
      "string.pattern.base": "Password must contain only letters and numbers",
      "any.required": "Password is required",
    }),
  role: Joi.string().valid("admin", "customer").required().messages({
    "string.empty": `role cannot be an empty field`,
    "any.only": "role must be admin or customer",
    "any.required": "role is required",
  }),
  blocked: Joi.boolean().messages({
    "boolean.base": "blocked must be true or false",
  }),
  deactivated: Joi.boolean().messages({
    "boolean.base": "deactivated must be true or false",
  }),
});

export { createUserValidation, updateUserValidation };
