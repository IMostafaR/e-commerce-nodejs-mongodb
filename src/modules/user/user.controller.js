import slugify from "slugify";
import { User } from "../../../database/models/user.model.js";
import { emailSender } from "../../utils/email/sendEmail.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

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

export { createUser };
