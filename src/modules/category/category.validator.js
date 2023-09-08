import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createCategory = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

export { createCategory };
