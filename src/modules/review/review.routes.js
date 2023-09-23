import { Router } from "express";

export const reviewRouter = Router();

reviewRouter("/").get().post();

reviewRouter("/:id").get().put().delete();
