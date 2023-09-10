import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createBrandValidation = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

const handleOneBrandValidation = Joi.object({
  id: mainValidationSchema.id,
});

export { createBrandValidation, handleOneBrandValidation };
