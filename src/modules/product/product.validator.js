import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const handleOneProductValidation = Joi.object({
  id: mainValidationSchema.id,
});

export { handleOneProductValidation };
