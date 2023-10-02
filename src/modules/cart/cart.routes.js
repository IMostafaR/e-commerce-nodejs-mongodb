import { Router } from "express";

export const cartRouter = Router();

cartRouter.route("/").get().post();
