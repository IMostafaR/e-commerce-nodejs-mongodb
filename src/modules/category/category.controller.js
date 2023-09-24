import { Category } from "../../../database/models/category.model.js";
import {
  createOne,
  handleAll,
  handleOne,
  updateOne,
} from "../../utils/handler/refactor.handler.js";

const populateOptions = {
  path: "createdBy updatedBy",
  select: "_id firstName lastName email role",
};

/**
 * create new category
 */
const createCategory = createOne(Category);

/**
 * update existing category
 */
const updateCategory = updateOne(Category);

/**
 * Get all categories from DB
 */
const getAllCategories = handleAll(Category);

/**
 * Get a specific category by its id from DB
 */
const getOneCategory = handleOne(Category);

/**
 * Delete a specific category by its id from DB
 */
const deleteOneCategory = handleOne(Category);

export {
  createCategory,
  updateCategory,
  getAllCategories,
  getOneCategory,
  deleteOneCategory,
};
