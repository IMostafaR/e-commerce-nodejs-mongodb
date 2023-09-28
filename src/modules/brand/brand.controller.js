import { Brand } from "../../../database/models/brand.model.js";
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
 * create new brnad
 */

const createBrand = createOne(Brand);

/**
 * update existing brand
 */
const updateBrand = updateOne(Brand);

/**
 * Get all brands from DB
 */
const getAllBrands = handleAll(Brand, populateOptions);

/**
 * Get a specific brand by its id from DB
 */
const getOneBrand = handleOne(Brand, populateOptions);

/**
 * Delete a specific brand by its id from DB
 */
const deleteOneBrand = handleOne(Brand);

export { createBrand, updateBrand, getAllBrands, getOneBrand, deleteOneBrand };
