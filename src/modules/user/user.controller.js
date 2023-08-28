import { catchAsyncError } from "../../utils/error/asyncError.js";

export const user = {
  //signup
  signup: catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, password, repeatPassword, phone } =
      req.body;

    res.json("success");
  }),
};
