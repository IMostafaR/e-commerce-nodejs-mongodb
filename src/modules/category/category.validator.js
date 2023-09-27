import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

/**
 * create new category validation schema
 */
const createCategoryValidation = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

const getOneCategoryValidation = Joi.object({
  id: mainValidationSchema.id,
});
const deleteOneCategoryValidation = Joi.object({
  id: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

export {
  createCategoryValidation,
  getOneCategoryValidation,
  deleteOneCategoryValidation,
};
