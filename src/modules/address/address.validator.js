import Joi from "joi";
import { mainValidationSchema } from "../../middleware/validation/validation.js";

const addAddressValidation = Joi.object({
  street: Joi.string().min(2).required().messages({
    "string.empty": `street cannot be an empty field`,
    "string.min": "street must be at least 2 characters long",
    "any.required": "street is required",
  }),
  city: Joi.string().min(2).required().messages({
    "string.empty": `city cannot be an empty field`,
    "string.min": "city must be at least 2 characters long",
    "any.required": "city is required",
  }),
  zipCode: Joi.number().min(10000).max(99999).required().messages({
    "number.empty": `zipCode cannot be an empty field`,
    "number.min": "Egyptian zipCode must be at least 5 digits long",
    "number.max": "zipCode cannot be more than 5 digits long",
    "any.required": "zipCode is required",
  }),
  country: Joi.string().min(2).required().messages({
    "string.empty": `country cannot be an empty field`,
    "string.min": "country must be at least 2 characters long",
    "any.required": "country is required",
  }),
  phone: mainValidationSchema.phone,
  token: mainValidationSchema.token,
});

const getAddressesValidation = Joi.object({
  token: mainValidationSchema.token,
});

const changeDefaultAddressValidation = Joi.object({
  addressId: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

const deleteSingleAddressValidation = Joi.object({
  addressId: mainValidationSchema.id,
  token: mainValidationSchema.token,
});

const deleteAllAddressesValidation = Joi.object({
  token: mainValidationSchema.token,
});

export {
  addAddressValidation,
  getAddressesValidation,
  changeDefaultAddressValidation,
  deleteSingleAddressValidation,
  deleteAllAddressesValidation,
};
