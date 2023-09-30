import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createCouponValidation = Joi.object({
  code: Joi.string().min(2).max(16).required().messages({
    "string.base": "Code should be a string",
    "string.empty": "Code cannot be empty",
    "string.min": "Code should have a minimum length of {#limit}",
    "string.max": "Code should have a maximum length of {#limit}",
    "any.required": "Code is a required field",
  }),
  expiresAt: Joi.date().required().messages({
    "date.base": "ExpiresAt should be a date",
    "date.empty": "ExpiresAt cannot be empty",
    "any.required": "ExpiresAt is a required field",
  }),
  discount: Joi.number().min(0).required().messages({
    "number.base": "Discount should be a number",
    "number.empty": "Discount cannot be empty",
    "number.min": "Discount should have a minimum value of {#limit}",
    "any.required": "Discount is a required field",
  }),
  maxUse: Joi.number().min(1).required().messages({
    "number.base": "MaxUse should be a number",
    "number.empty": "MaxUse cannot be empty",
    "number.min": "MaxUse should have a minimum value of {#limit}",
    "any.required": "MaxUse is a required field",
  }),
  token: mainValidationSchema.token,
});

export { createCouponValidation };
