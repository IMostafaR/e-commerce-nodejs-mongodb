import { emailSender } from "../../utils/email/sendEmail.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

export const user = {
  // signup

  signup: catchAsyncError(async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      phone,
      address,
    } = req.body;
    // emailSender;
  }),
};
