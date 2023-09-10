import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createSubcategoryValidation = Joi.object({
  name: mainValidationSchema.name,
  category: mainValidationSchema.id,
});

const updateSubcategoryValidation = Joi.object({
  id: mainValidationSchema.id,
  name: mainValidationSchema.name,
  category: mainValidationSchema.id,
});

const handleOneSubcategoryValidation = Joi.object({
  id: mainValidationSchema.id,
});

export {
  createSubcategoryValidation,
  updateSubcategoryValidation,
  handleOneSubcategoryValidation,
};
