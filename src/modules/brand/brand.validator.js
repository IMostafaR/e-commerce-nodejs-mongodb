import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createBrandValidation = Joi.object({
  name: mainValidationSchema.name,
}).options({ allowUnknown: true });

const getOneBrandValidation = Joi.object({
  id: mainValidationSchema.id,
});
const deleteOneBrandValidation = Joi.object({
  id: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

export {
  createBrandValidation,
  getOneBrandValidation,
  deleteOneBrandValidation,
};
