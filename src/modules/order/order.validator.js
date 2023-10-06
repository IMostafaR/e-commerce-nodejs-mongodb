import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createOrderValidation = Joi.object({
  token: mainValidationSchema.token,
  addressID: mainValidationSchema.id,
  paymentMethod: Joi.string().valid("cash", "card").required().messages({
    "string.base": "paymentMethod must be a string",
    "string.empty": "paymentMethod cannot be an empty field",
    "any.only": "paymentMethod must be either cash or card",
    "any.required": "paymentMethod is required",
  }),
});

const getAllUserOrdersValidation = Joi.object({
  token: mainValidationSchema.token,
});

export { createOrderValidation, getAllUserOrdersValidation };
