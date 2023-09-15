import slugify from "slugify";
import { User } from "../../../database/models/user.model.js";
import { emailSender } from "../../utils/email/sendEmail.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import * as pass from "../../utils/password/passwordHashing.js";
import Jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * signup new users
 **/
const signup = catchAsyncError(async (req, res, next) => {
  // Request Data
  const { firstName, lastName, email, password } = req.body;

  let slug = `${firstName} ${lastName}`;

  slug = slugify(slug);

  // Check if email exists in the DB
  const existingEmail = await User.findOne({ email });

  if (existingEmail)
    return next(new AppError(`${email} already registered`, 409));

  // Save user data into DB
  const newUser = await User.create({
    firstName,
    lastName,
    slug,
    email,
    password,
  });

  // email confirmation link creation with token
  const token = Jwt.sign(
    { email: newUser.email },
    process.env.VERIFY_EMAIL_KEY,
    {
      expiresIn: 60 * 10,
    }
  );

  const refreshToken = Jwt.sign(
    { email: newUser.email },
    process.env.VERIFY_EMAIL_KEY
  ); // to be sent to user's email to ask for new token if the original token has expired

  const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/verifyEmail/${token}`; // main confirmation link
  const resendEmailLink = `${req.protocol}://${req.headers.host}/api/v1/auth/resendEmail/${refreshToken}`; // to ask for new confirmation link

  const html = `<a href="${confirmationLink}" target="_blank">Verify Email</a> <br />
  <p>If the link above isn't working <a href="${resendEmailLink}" target="_blank">click here</a> to resend new confirmation email</p>`;

  // Send confirmation email
  await emailSender({
    email: newUser.email,
    subject: "Confirmation email",
    html,
  });

  // Send successful response
  res.status(201).json({
    status: "success",
    message:
      "Account successfully created. Please check your email to confirm your account before trying to login",
    data: newUser,
  });
});

/**
 * Send email verification to user's email inbox
 */
const verifyEmail = catchAsyncError(async (req, res, next) => {
  // Request Data
  const { token } = req.params;

  // verify token from request params
  Jwt.verify(token, process.env.VERIFY_EMAIL_KEY, async (error, decoded) => {
    if (error) return next(new AppError("Invalid token", 401));

    // Search for this email in the DB
    const existingUser = await User.findOne({ email: decoded.email });

    // Email not exist error
    if (!existingUser)
      return next(
        new AppError(
          `${decoded.email} is not registered. Please signup first`,
          404
        )
      );

    // Email is already verified error
    if (existingUser.verifiedEmail)
      return next(
        new AppError(`${decoded.email} is already verified. Please login.`, 409)
      );

    // Verify email in DB and save
    existingUser.verifiedEmail = true;
    await existingUser.save();

    // Send successful response
    res.status(200).json({
      status: "success",
      message: "Email successfully verified",
      data: existingUser,
    });
  });
});

/**
 * Resend verification email due to token expiration
 */
const resendVerificationEmail = catchAsyncError(async (req, res, next) => {
  // Request Data
  const { refreshToken } = req.params;

  // verify token from request params
  Jwt.verify(
    refreshToken,
    process.env.VERIFY_EMAIL_KEY,
    async (error, decoded) => {
      if (error) return next(new AppError("Invalid token", 401));

      // email confirmation link creation with token
      const token = Jwt.sign(
        { email: decoded.email },
        process.env.VERIFY_EMAIL_KEY,
        {
          expiresIn: 60 * 10,
        }
      );

      const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/verifyEmail/${token}`; // main confirmation link

      const html = `<a href="${confirmationLink}" target="_blank">Verify Email</a> <br />`;

      // Send confirmation email
      await emailSender({
        email: decoded.email,
        subject: "Confirmation email",
        html,
      });

      // Send successful response
      res.status(200).json({
        status: "success",
        message: `New email sent to ${decoded.email}`,
      });
    }
  );
});

/**
 * user login
 */
const login = catchAsyncError(async (req, res, next) => {
  // Request Data
  const { email, password } = req.body;

  // find if user exists in DB
  const user = await User.findOne({
    email,
  });
  // check if the user verified their email
  if (user && !user.verifiedEmail)
    return next(
      new AppError(
        "You have to verify your email before trying to login. Please check your email inbox.",
        401
      )
    );

  // check if the user's account is blocked
  if (user && user.blocked)
    return next(
      new AppError("Sorry! your account is blocked. Please contact us", 403)
    );

  // check if the user's password is correct
  if (!user || !pass.compare(password, user.password))
    return next(new AppError("Incorrect email or password", 401));

  // if all cases above didn't throw error:
  // * generate secret key and save it to DB (to be changed when the user logout)
  user.jwtSecretKey = crypto.randomBytes(32).toString("hex");
  await user.save();

  /* generate token with payload contains _id to retrieve user data in auth middleware */
  const idToken = Jwt.sign({ id: user._id }, process.env.SECRET_KEY);

  /* generate token with payload contains user's data to confirm if user authorized in auth middleware */
  const authToken = Jwt.sign(
    {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    },
    user.jwtSecretKey,
    {
      expiresIn: "30d",
    }
  );

  // Send successful response
  res.status(200).json({
    status: "success",
    message: `Welcome ${user.firstName}`,
    idToken,
    authToken,
  });
});

/**
 * user logout
 */
const logout = catchAsyncError(async (req, res, next) => {
  const id = req.userId;

  const user = await User.findById(id);

  user.jwtSecretKey = crypto.randomBytes(32).toString("hex");
  await user.save();

  res.status(200).json({
    status: "success",
    message: `${user.email} logged out successfully`,
  });
});

/**
 * Send code to user's email inbox due to a request to reset user's password
 */
const resetPassCode = catchAsyncError(async (req, res, next) => {
  // Request Data
  const { email } = req.body;

  // find if user exists in DB
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Account is not exist", 404));

  // generate random code and save it to DB
  const code = crypto.randomBytes(3).toString("hex");
  user.resetPassCode = code;
  await user.save();

  // send email to user with reset code
  const html = `<p>This email is sent to you upon your request to reset your password</p>
  <h1>Code: ${code}</h1>
  <p>If you did not request resetting your password, ignore this email</p>
  `;

  await emailSender({
    email: user.email,
    subject: "Request to reset password",
    html,
  });

  res.status(200).json({
    status: "success",
    message: `Reset code has been sent to ${user.email}.`,
  });
});

/**
 * Reset password
 */
const resetPassword = catchAsyncError(async (req, res, next) => {
  // Request Data
  const { email, code, password } = req.body;

  // find if user exists in DB
  let user = await User.findOne({ email });
  if (!user) return next(new AppError("Account is not exist", 404));

  if (user && user.resetPassCode !== code)
    return next(new AppError("Incorrect code", 401));

  const hashedPassword = pass.hash(password);
  const jwtSecretKey = crypto.randomBytes(32).toString("hex");

  user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword, jwtSecretKey, $unset: { resetPassCode: 1 } }
  );

  return res.status(200).json({
    status: "success",
    message: `Your password has been successfully reset. Please try to login`,
  });
});

export {
  signup,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
  resetPassCode,
  resetPassword,
};
