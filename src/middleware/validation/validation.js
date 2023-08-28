import { AppError } from "../../utils/error/appError.js";

export const validation = (schema) => {
  const reqData = { ...req.body, ...req.params, ...req.query };

  const { error } = schema.validate(reqData, { abortEarly: false });

  if (error) return new AppError(error.message, 400);

  next();
};
