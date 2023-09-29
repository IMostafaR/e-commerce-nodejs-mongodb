import { Router } from "express";
import {
  addAddress,
  changeDefaultAddress,
  deleteAllAddresses,
  deleteSingleAddress,
  getAddresses,
} from "./address.controller.js";
import { authenticate } from "../auth/auth.controller.js";

export const addressRouter = Router();

addressRouter
  .route("/")
  .get(authenticate, getAddresses)
  .post(authenticate, addAddress)
  .put(authenticate, deleteSingleAddress)
  .patch(authenticate, changeDefaultAddress)
  .delete(authenticate, deleteAllAddresses);
