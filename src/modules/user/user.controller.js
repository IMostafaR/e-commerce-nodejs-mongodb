import slugify from "slugify";
import { User } from "../../../database/models/user.model.js";
import { emailSender } from "../../utils/email/sendEmail.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { pass } from "../../utils/password/passwordHashing.js";
import Jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const user = {
  //signup
  signup: catchAsyncError(async (req, res, next) => {
    // Request Data
    const { firstName, lastName, email, password } = req.body;

    let slug = `${firstName} ${lastName}`;

    slug = slugify(slug);

    // Check if email exists in the DB
    const existingEmail = await User.findOne({ email });

    if (existingEmail)
      return next(new AppError(`${email} already registered`, 409));

    // Password Hashing
    const hashedPassword = pass.hash(password);

    // Save user data into DB
    const newUser = await User.create({
      firstName,
      lastName,
      slug,
      email,
      password: hashedPassword,
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

    const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/user/verifyEmail/${token}`; // main confirmation link
    const resendEmailLink = `${req.protocol}://${req.headers.host}/api/v1/user/resendEmail/${refreshToken}`; // to ask for new confirmation link

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
  }),

  verifyEmail: catchAsyncError(async (req, res, next) => {
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
          new AppError(
            `${decoded.email} is already verified. Please login.`,
            409
          )
        );

      // Verify email in DB and save
      existingUser.verifiedEmail = true;
      await existingUser.save();

      // Send successful response
      res.status(201).json({
        status: "success",
        message: "Email successfully verified",
        data: existingUser,
      });
    });
  }),

  // resendVerificationEmail with refreshToken
  resendVerificationEmail: (req, res, next) => {
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

        const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/user/verifyEmail/${token}`; // main confirmation link

        const html = `<a href="${confirmationLink}" target="_blank">Verify Email</a> <br />`;

        // Send confirmation email
        await emailSender({
          email: decoded.email,
          subject: "Confirmation email",
          html,
        });

        // Send successful response
        res.status(201).json({
          status: "success",
          message: `New email sent to ${decoded.email}`,
        });
      }
    );
  },

  // login

  login: catchAsyncError(async (req, res, next) => {
    // Request Data
    const { email, password } = req.body;

    // find if user exists in DB
    const user = await User.findOne({
      email,
    });
    console.log(Boolean(user));
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
    const jwtSecretKey = uuidv4();
    user.jwtSecretKey = jwtSecretKey;
    await user.save();

    // generate token
    const token = Jwt.sign(
      {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
      jwtSecretKey,
      {
        expiresIn: "183d",
      }
    );

    // Send successful response
    res.status(201).json({
      status: "success",
      message: `Welcome ${user.firstName}`,
      token,
    });
  }),
};
