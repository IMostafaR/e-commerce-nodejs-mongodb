import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

export const userValidatorSchema = {
  // signup
  signup: Joi.object({
    firstName: mainValidationSchema.firstName,
    lastName: mainValidationSchema.lastName,
    email: mainValidationSchema.email,
    password: mainValidationSchema.password,
    repeatPassword: mainValidationSchema.repeatPassword,
    phone: mainValidationSchema.phone,
  }),
};
