import { Router } from "express";
import { validation } from "../../middleware/validation/validation.js";
import { createUserValidation } from "./user.validator.js";
import { createUser, getAllUsers } from "./user.controller.js";

export const userRouter = Router();

userRouter
  .route("/")
  .post(validation(createUserValidation), createUser)
  .get(getAllUsers);
