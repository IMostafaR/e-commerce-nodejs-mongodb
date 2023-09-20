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

export { createUserValidation };
