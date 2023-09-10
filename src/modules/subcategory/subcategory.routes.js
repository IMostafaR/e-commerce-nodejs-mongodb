import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  createSubcategoryValidation,
  handleOneSubcategoryValidation,
  updateSubcategoryValidation,
} from "./subcategory.validator.js";

/**
 * Express Router for managing subcategories and their related routes.
 *
 * @type {express.Router}
 */
export const subcategoryRouter = Router({ mergeParams: true });

// Define routes for managing subcategories
subcategoryRouter
  .route("/")
  /**
   * Route for retrieving all subcategories or all subcategories associated with a specific category.
   *
   * @name GET /subcategories or /categories/:categoryId/subcategories
   * @function
   * @memberof subcategoryRouter
   * @inner
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next middleware function.
   * @throws {AppError} If no subcategories, it throws a 404 Not Found error.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  .get(subcategory.getAllSubcategories)

  /**
   * Route for creating a new subcategory associated with a specific category.
   *
   * @name POST /subcategories
   * @function
   * @memberof subcategoryRouter
   * @inner
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next middleware function.
   * @throws {AppError} If the subcategory already exists, it throws a 409 Conflict error.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  .post(validation(createSubcategoryValidation), subcategory.createSubcategory);

subcategoryRouter
  .route("/:id")
  /**
   * Route for retrieving a specific subcategory by its ID.
   *
   * @name GET  /subcategories/:id
   * @function
   * @memberof subcategoryRouter
   * @inner
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next middleware function.
   * @throws {AppError} If the requested subcategory by ID is not found, it may throw a 404 Not Found error.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  .get(
    validation(handleOneSubcategoryValidation),
    subcategory.getOneSubcategory
  )

  /**
   * Route for updating a specific subcategory by its ID.
   *
   * @name PUT /subcategories/:id
   * @function
   * @memberof subcategoryRouter
   * @inner
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next middleware function.
   * @throws {AppError} If the requested subcategory by ID is not found, it may throw a 404 Not Found error.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  .put(validation(updateSubcategoryValidation), subcategory.updateSubcategory)

  /**
   * Route for deleting a specific subcategory by its ID.
   *
   * @name DELETE /subcategories/:id
   * @function
   * @memberof subcategoryRouter
   * @inner
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {Express.NextFunction} next - The Express next middleware function.
   * @throws {AppError} If the requested subcategory by ID is not found, it may throw a 404 Not Found error.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  .delete(
    validation(handleOneSubcategoryValidation),
    subcategory.deleteOneSubcategory
  );
