import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createBrand = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

const handleOneBrand = Joi.object({
  id: mainValidationSchema.id,
});

export { createBrand, handleOneBrand };
