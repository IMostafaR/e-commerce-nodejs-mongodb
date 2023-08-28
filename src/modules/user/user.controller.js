import { catchAsyncError } from "../../utils/error/asyncError.js";

export const user = {
  signup: catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, password, repeatPassword, phone } =
      req.body;
  }),
};
