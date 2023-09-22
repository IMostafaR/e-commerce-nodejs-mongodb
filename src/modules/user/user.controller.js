import slugify from "slugify";
import { User } from "../../../database/models/user.model.js";
import { emailSender } from "../../utils/email/sendEmail.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";
import crypto from "crypto";

/**
 * Create a new user based on the provided request body fields.
 *
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the provided email already exists in the database, it returns a 409 Conflict error.
 * @throws {AppError} If there's an issue sending the welcome email, it returns a 500 Internal Server Error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const createUser = catchAsyncError(async (req, res, next) => {
  // Extract data from the request body
  const { firstName, lastName, email, password, role, verifiedEmail } =
    req.body;

  // Check if the provided email already exists in the database
  const existingEmail = await User.findOne({ email });

  if (existingEmail)
    return next(new AppError(`${email} already registered`, 409));

  // Prepare the HTML for the welcome email
  const html = `<h2>Congratulations</h2> <br />
    <p>Your ${role} account has been created successfully. Please use the following email and password to login.</p>
    <p>Please change your password after your first successful login.</p>
    <p><b>Email address: </b>${email}</p>
    <p><b>Password: </b>${password}</p>`;

  // Send the welcome email
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

  // Generate a slug based on the user's first and last name
  const slug = slugify(`${firstName} ${lastName}`);

  // Create a new user and save their data into the database
  const newUser = await User.create({
    firstName,
    lastName,
    slug,
    email,
    password,
    role,
    verifiedEmail,
  });

  // Send a successful response
  res.status(201).json({
    status: "success",
    message: "Account successfully created.",
    data: newUser,
  });
});

/**
 * Update user information based on the provided request body fields.
 *
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the user with the specified ID is not found, it returns a 404 error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @example
 * // Example usage in an Express route handler:
 * app.put('/users/:id', updateUser);
 */

const updateUser = catchAsyncError(async (req, res, next) => {
  // Extract data from the request
  const { id } = req.params;
  const { firstName, lastName, password, blocked, role, deactivated } =
    req.body;

  // Find the existing user by ID
  const existingUser = await User.findById(id);

  // If the user is not found, return a 404 error
  if (!existingUser)
    return next(
      new AppError(`Sorry, the user with id ${id} is not registered`, 404)
    );

  // Update the user's slug based on changes to the first name and last name
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

  /**Generate a new securityDate to enhance security and force users to login again
   when sensitive user information like password, blocked status, role, or deactivation is updated */
  if (password || blocked || role || deactivated) {
    const securityDate = parseInt(Date.now() / 1000);
    req.body.securityDate = securityDate;
  }

  // Update the user and return the updated user data
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  // Send a success response with the updated user data
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
