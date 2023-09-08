import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

/**
 * create new category validation schema
 */
const createCategory = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

const handleOneCategory = Joi.object({
  id: mainValidationSchema.id,
});

export { createCategory, handleOneCategory };
