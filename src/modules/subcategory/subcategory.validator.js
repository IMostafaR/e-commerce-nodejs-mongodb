import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createSubcategoryValidation = Joi.object({
  name: mainValidationSchema.name,
  category: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

const updateSubcategoryValidation = Joi.object({
  id: mainValidationSchema.id,
  name: mainValidationSchema.name,
  category: mainValidationSchema.id,
});

const getOneSubcategoryValidation = Joi.object({
  id: mainValidationSchema.id,
});
const deleteOneSubcategoryValidation = Joi.object({
  id: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

export {
  createSubcategoryValidation,
  updateSubcategoryValidation,
  getOneSubcategoryValidation,
  deleteOneSubcategoryValidation,
};
