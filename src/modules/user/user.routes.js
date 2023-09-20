import { Router } from "express";
import { validation } from "../../middleware/validation/validation.js";
import {
  createUserValidation,
  updateUserValidation,
} from "./user.validator.js";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "./user.controller.js";

export const userRouter = Router();

userRouter
  .route("/")
  .post(validation(createUserValidation), createUser)
  .get(getAllUsers);

userRouter
  .route("/:id")
  .get(getOneUser)
  .put(validation(updateUserValidation), updateUser)
  .delete(deleteOneUser);
