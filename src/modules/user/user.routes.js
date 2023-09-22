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
import { authenticate, authorize } from "../auth/auth.controller.js";

export const userRouter = Router();

userRouter
  .route("/")
  .post(
    validation(createUserValidation),
    authenticate,
    authorize("admin"),
    createUser
  )
  .get(authenticate, authorize("admin"), getAllUsers);

userRouter
  .route("/:id")
  .get(authenticate, authorize("admin"), getOneUser)
  .put(
    validation(updateUserValidation),
    authenticate,
    authorize("admin"),
    updateUser
  )
  .delete(authenticate, authorize("admin"), deleteOneUser);
