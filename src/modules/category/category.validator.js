import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

/**
 * create new category validation schema
 */
const createCategoryValidation = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

const handleOneCategoryValidation = Joi.object({
  id: mainValidationSchema.id,
});

export { createCategoryValidation, handleOneCategoryValidation };
