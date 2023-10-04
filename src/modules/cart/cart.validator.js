import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const addToCartValidation = Joi.object({
  token: mainValidationSchema.token,
  productID: mainValidationSchema.id,
  quantity: Joi.number().min(1).required().messages({
    "number.base": "quantity must be a number",
    "number.empty": "quantity cannot be an empty field",
    "number.min": "quantity cannot be less than one",
    "any.required": "quantity is required",
  }),
});

const getCartValidation = Joi.object({
  token: mainValidationSchema.token,
});

const deleteProductFromCartValidation = Joi.object({
  token: mainValidationSchema.token,
  productID: mainValidationSchema.id,
});

const deleteCartValidation = Joi.object({
  token: mainValidationSchema.token,
});

export {
  addToCartValidation,
  getCartValidation,
  deleteProductFromCartValidation,
  deleteCartValidation,
};
