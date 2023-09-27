import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createProductValidation = Joi.object({
  name: mainValidationSchema.name,
  description: Joi.string().min(10).max(100).required().messages({
    "string.empty": "description cannot be an empty field",
    "string.min": "description must be at least 10 characters long",
    "string.max": "description cannot be more than 200 characters long",
    "any.required": "description is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.empty": "price cannot be an empty field",
    "number.min": "price cannot be less than zero",
    "any.required": "price is required",
  }),
  discount: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.custom": "Invalid discount value",
      "any.required": "discount is required",
    })
    .messages({
      "number.empty": "discount cannot be an empty field",
      "number.min": "discount cannot be less than zero",
      "any.required": "discount is required",
    }),
  quantity: Joi.number().min(0).required().messages({
    "number.empty": "quantity cannot be an empty field",
    "number.min": "quantity cannot be less than zero",
    "any.required": "quantity is required",
  }),
  soldItems: Joi.number().min(0).required().messages({
    "number.empty": "sold items cannot be an empty field",
    "number.min": "sold items cannot be less than zero",
    "any.required": "sold items is required",
  }),
  ratingAvg: Joi.number().min(1).max(5).messages({
    "number.empty": "ratingAvg cannot be an empty field",
    "number.min": "ratingAvg cannot be less than one",
    "number.max": "ratingAvg cannot be more than five",
  }),
  category: mainValidationSchema.id,
  subcategory: mainValidationSchema.id,
  brand: mainValidationSchema.id,
  token: mainValidationSchema.token,
}).custom((values, helpers) => {
  const validDiscount = values.discount <= values.price;
  const validSoldItems = values.soldItems <= values.quantity;

  if (!validDiscount && !validSoldItems) {
    return helpers.message(
      "Discount should be less than the price of the product and sold items should be less than the quantity of the product"
    );
  } else if (!validDiscount) {
    return helpers.message(
      "Discount should be less than the price of the product"
    );
  } else if (!validSoldItems) {
    return helpers.message(
      "Sold items should be less than the quantity of the product"
    );
  }
}, "custom validation");

const handleOneProductValidation = Joi.object({
  id: mainValidationSchema.id,
});

export { createProductValidation, handleOneProductValidation };
