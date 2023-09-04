import { db } from "../database/connection.js";
import { globalErrorHandler } from "./middleware/error/globalErrorHandler.js";
import { categoryRouter } from "./modules/category/category.routes.js";
import { userRouter } from "./modules/user/user.routes.js";
import { AppError } from "./utils/error/appError.js";
import morgan from "morgan";

export const router = (app, express) => {
  process.on("unhandledRejection", (error) => {
    console.error("Error: ", error);
  });
  process.on("uncaughtException", (error) => {
    console.error("Error: ", error);
  });

  db();
  app.use(express.json());
  app.use(morgan("dev"));
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/uploads", express.static("uploads"));
  app.all("*", (req, res, next) => {
    next(new AppError(`invalid routing ${req.originalUrl}`, 404));
  });
  app.use(globalErrorHandler());
};
