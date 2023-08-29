import { User } from "../../../database/models/user.model.js";
import { emailSender } from "../../utils/email/sendEmail.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { pass } from "../../utils/password/passwordHashing.js";
import Jwt from "jsonwebtoken";

export const user = {
  //signup
  signup: catchAsyncError(async (req, res, next) => {
    // Request Data
    const { firstName, lastName, email, password } = req.body;

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
      email,
      password: hashedPassword,
    });

    // email confirmation link creation with token
    const token = Jwt.sign({ email }, process.env.VERIFY_EMAIL_KEY, {
      expiresIn: 60 * 10,
    });

    const refreshToken = Jwt.sign({ email }, process.env.VERIFY_EMAIL_KEY); // to be sent to user's email to ask for new token if the original token has expired

    const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/user/verifyEmail/${token}`; // main confirmation link
    const resendEmailLink = `${req.protocol}://${req.headers.host}/api/v1/user/resendEmail/${refreshToken}`; // to ask for new confirmation link

    const html = `<a href="${confirmationLink}" target="_blank">Verify Email</a> <br />
    <p>If the link above isn't working <a href="${resendEmailLink}" target="_blank">click here</a> to resend new confirmation email</p>`;

    // Send confirmation email
    await emailSender({
      email,
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

  verifyEmail: (req, res, next) => {
    const { token } = req.params;
    Jwt.verify(token, process.env.VERIFY_EMAIL_KEY, async (error, decoded) => {
      if (error) return next(new AppError("Invalid token", 401));

      const verifiedUser = await User.findOneAndUpdate(
        {
          email: decoded.email,
        },
        { verifiedEmail: true },
        { new: true }
      );

      res.status(201).json({
        status: "success",
        message: "Email successfully verified",
        data: verifiedUser,
      });
    });
  },

  resendVerificationEmail: (req, res, next) => {
    const { refreshToken } = req.params;
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
};
