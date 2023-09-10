import slugify from "slugify";
import { Subcategory } from "../../../database/models/subcategory.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";

/**
 * Middleware for creating a new subcategory.
 *
 * @function
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the subcategory already exists, it throws a 409 Conflict error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @example
 * // Example usage in an Express route handler:
 * app.post('/subcategories', createSubcategory);
 */
const createSubcategory = catchAsyncError(async (req, res, next) => {
  // Extract data from the request body
  const { name, category } = req.body;

  // Check if a subcategory with the same name exists
  const existingSubcategory = await Subcategory.findOne({ name });

  // If a subcategory with the same name exists, return an error response
  if (existingSubcategory)
    return next(new AppError("Subcategory already exists", 409));

  // Generate a slug for the subcategory name
  const slug = slugify(name);

  // Create a new subcategory
  const newSubcategory = await Subcategory.create({ name, slug, category });

  // Send a success response with the new subcategory data
  res.status(201).json({
    status: "success",
    message: "Subcategory added successfully",
    data: newSubcategory,
  });
});

/**
 * Middleware for updating a subcategory by its ID.
 *
 * @function
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the subcategory with the specified ID cannot be found, it throws a 404 Not Found error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @example
 * // Example usage in an Express route handler:
 * app.put('/subcategories/:id', updateSubcategory);
 */
const updateSubcategory = catchAsyncError(async (req, res, next) => {
  // Extract data from the request parameters and body
  const { id } = req.params;
  const { name, category } = req.body;

  // Find the existing subcategory by its ID
  const existingSubcategory = await Subcategory.findById(id);

  // If the subcategory with the specified ID doesn't exist, return an error response
  if (!existingSubcategory)
    return next(
      new AppError(`Sorry, the subcategory with id ${id} cannot be found`, 404)
    );

  // Update the subcategory data if provided in the request
  if (name) {
    // Generate a slug for the new name
    const slug = slugify(name);
    existingSubcategory.name = name;
    existingSubcategory.slug = slug;
  }

  // Update the category reference if provided in the request
  if (category) existingSubcategory.category = category;

  // Save the updated subcategory
  const updatedSubcategory = await existingSubcategory.save();

  // Send a success response with the updated subcategory data
  res.status(200).json({
    status: "success",
    message: "Subcategory updated successfully",
    data: updatedSubcategory,
  });
});

/**
 * Middleware for retrieving all subcategories from the database.
 *
 * This middleware uses the `handleAll` middleware to handle requests for listing
 * documents of the `Subcategory` model. It supports pagination, filtering, sorting,
 * and searching based on the request query parameters.
 *
 * @function
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If no subcategories are found or if there are errors in the process,
 * it may throw the following errors:
 *   - 404 Not Found: If no subcategories exist.
 *   - 404 Not Found: If a category or page is not found.
 *   - 500 Internal Server Error: If there are other unexpected errors.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @example
 * // Example usage in an Express route handler:
 * app.get('categories/:categoryId/subcategories', getAllSubcategories);
 */
const getAllSubcategories = handleAll(Subcategory);

/**
 * Middleware for retrieving a specific subcategory by its ID from the database.
 *
 * This middleware uses the `handleOne` middleware to handle requests for retrieving
 * a single document of the `Subcategory` model by its ID.
 *
 * @function
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the requested subcategory by ID is not found, it may throw a
 * 404 Not Found error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @example
 * // Example usage in an Express route handler:
 * app.get('/subcategories/:id', getOneSubcategory);
 */
const getOneSubcategory = handleOne(Subcategory);

/**
 * Middleware for deleting a specific subcategory by its ID from the database.
 *
 * This middleware uses the `handleOne` middleware to handle requests for deleting
 * a single document of the `Subcategory` model by its ID.
 *
 * @function
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The Express next middleware function.
 *
 * @throws {AppError} If the requested subcategory by ID is not found, it may throw a
 * 404 Not Found error.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @example
 * // Example usage in an Express route handler:
 * app.delete('/subcategories/:id', deleteOneSubcategory);
 */
const deleteOneSubcategory = handleOne(Subcategory);

export {
  createSubcategory,
  updateSubcategory,
  getAllSubcategories,
  getOneSubcategory,
  deleteOneSubcategory,
};
