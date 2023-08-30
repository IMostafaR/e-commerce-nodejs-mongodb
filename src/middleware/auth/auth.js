import { User } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import Jwt from "jsonwebtoken";

export const auth = catchAsyncError(async (req, res, next) => {
  const { idtoken, authtoken } = req.headers;

  Jwt.verify(idtoken, process.env.SECRET_KEY, async (error, decoded) => {
    if (error) return next(new AppError("Invalid token", 401));

    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError("No such user exist", 404));

    Jwt.verify(authtoken, user.jwtSecretKey, (error, decoded) => {
      if (error)
        return next(new AppError("Unauthorized. Please login first", 403));

      req.userId = decoded.id;
      next();
    });
  });
});
