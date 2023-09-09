import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createSubcategoryValidation = Joi.object({
  name: mainValidationSchema.name,
  category: mainValidationSchema.id,
});

export { createSubcategoryValidation };
