import slugify from "slugify";
import { User } from "../../../database/models/user.model.js";
import { emailSender } from "../../utils/email/sendEmail.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";
import crypto from "crypto";

const createUser = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password, role, verifiedEmail } =
    req.body;

  /**
   * Check if the provided email already exists in the database.
   * @type {mongoose.Document | null}
   */
  const existingEmail = await User.findOne({ email });

  if (existingEmail)
    return next(new AppError(`${email} already registered`, 409));

  const html = `<h2>Congratulations</h2> <br />
    <p>Your ${role} account has been created successfully. Please use the following email and password to login.</p>
    <p>Please change your password after your first successful login.</p>
    <p><b>Email address: </b>${email}</p>
    <p><b>Password: </b>${password}</p>`;

  /**
   * Send the welcome email.
   */
  const welcomeEmail = await emailSender({
    email,
    subject: `Congratulations! Your ${role} account has been created successfully`,
    html,
  });

  if (!welcomeEmail)
    return next(
      new AppError(
        "Something went wrong while sending email. Please try again later",
        500
      )
    );

  /**
   * Generate a slug based on the user's first and last name.
   * @type {string}
   */
  let slug = `${firstName} ${lastName}`;

  slug = slugify(slug);

  /**
   * Create a new user and save their data into the database.
   * @type {mongoose.Document}
   */
  const newUser = await User.create({
    firstName,
    lastName,
    slug,
    email,
    password,
    role,
    verifiedEmail,
  });
  /**
   * Send a successful response.
   */
  res.status(201).json({
    status: "success",
    message: "Account successfully created.",
    data: newUser,
  });
});

/**
 * update existing user's data
 */

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, password, blocked, role, deactivated } =
    req.body;

  const existingUser = await User.findById(id);

  if (!existingUser)
    return next(
      new AppError(`Sorry, the user with id ${id}  cannot be found`, 404)
    );

  if (firstName && lastName) {
    const slug = slugify(`${firstName} ${lastName}`);
    req.body.slug = slug;
  }

  if (firstName && !lastName) {
    const slug = slugify(`${firstName} ${existingUser.lastName}`);
    req.body.slug = slug;
  }

  if (!firstName && lastName) {
    const slug = slugify(`${existingUser.firstName} ${lastName}`);
    req.body.slug = slug;
  }

  if (password || blocked || role || deactivated) {
    const jwtSecretKey = crypto.randomBytes(32).toString("hex");
    req.body.jwtSecretKey = jwtSecretKey;
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: `User with id ${id} updated successfully`,
    data: updatedUser,
  });
});

/**
 * Get all users from DB
 */
const getAllUsers = handleAll(User);

/**
 * Get a specific user by its id from DB
 */
const getOneUser = handleOne(User);

/**
 * Delete a specific user by its id from DB
 */
const deleteOneUser = handleOne(User);

export { createUser, updateUser, getAllUsers, getOneUser, deleteOneUser };
