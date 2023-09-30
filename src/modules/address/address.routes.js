import { Router } from "express";
import {
  addAddress,
  changeDefaultAddress,
  deleteAllAddresses,
  deleteSingleAddress,
  getAddresses,
} from "./address.controller.js";
import { authenticate } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  addAddressValidation,
  changeDefaultAddressValidation,
  deleteAllAddressesValidation,
  deleteSingleAddressValidation,
  getAddressesValidation,
} from "./address.validator.js";

export const addressRouter = Router();

addressRouter
  .route("/")
  .get(validation(getAddressesValidation), authenticate, getAddresses)
  .post(validation(addAddressValidation), authenticate, addAddress)
  .put(
    validation(deleteSingleAddressValidation),
    authenticate,
    deleteSingleAddress
  )
  .patch(
    validation(changeDefaultAddressValidation),
    authenticate,
    changeDefaultAddress
  )
  .delete(
    validation(deleteAllAddressesValidation),
    authenticate,
    deleteAllAddresses
  );
