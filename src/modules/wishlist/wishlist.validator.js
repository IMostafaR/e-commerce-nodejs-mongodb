import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const addWishlistValidation = Joi.object({
  productId: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

const getWishlistValidation = Joi.object({
  token: mainValidationSchema.token,
});

const deleteProductFromWishlistValidation = Joi.object({
  productId: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

const deleteAllWishlistValidation = Joi.object({
  token: mainValidationSchema.token,
});

export {
  addWishlistValidation,
  getWishlistValidation,
  deleteProductFromWishlistValidation,
  deleteAllWishlistValidation,
};
