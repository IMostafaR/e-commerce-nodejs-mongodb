import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const createReviewValidation = Joi.object({
  title: Joi.string().min(2).max(30).required().messages({
    "string.empty": `title cannot be an empty field`,
    "string.min": "title must be at least 2 characters long",
    "string.max": "title cannot be more than 30 characters long",
    "any.required": "title is required",
  }),
  content: Joi.string().min(2).max(200).required().messages({
    "string.empty": `content cannot be an empty field`,
    "string.min": "content must be at least 2 characters long",
    "string.max": "content cannot be more than 200 characters long",
    "any.required": "content is required",
  }),
  rate: Joi.number().min(1).max(5).required().messages({
    "number.empty": `rate cannot be an empty field`,
    "number.min": "rate must be at least 1",
    "number.max": "rate cannot be more than 5",
    "any.required": "rate is required",
  }),
  id: mainValidationSchema.id, // product id
  token: mainValidationSchema.token,
});

export { createReviewValidation };
