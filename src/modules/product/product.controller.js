import slugify from "slugify";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import cloudinary from "../../utils/cloud/cloud.js";
import { Product } from "../../../database/models/product.model.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";

const populateOptions = {
  path: "createdBy updatedBy category subcategory brand reviews",
  select: "name slug firstName lastName email role -_id title content",
};
/**
 * create new product
 */
const createProduct = catchAsyncError(async (req, res, next) => {
  let {
    name,
    description,
    price,
    discount,
    quantity,
    soldItems,
    category,
    subcategory,
    brand,
  } = req.body;

  // Create slug
  const slug = slugify(name);
  // Get the id of the user who created the product
  const { id: createdBy, id: updatedBy } = req.user;

  // Create product data object
  const productData = {
    name,
    description,
    price,
    discount,
    quantity,
    soldItems,
    category,
    subcategory,
    brand,
    slug,
    createdBy,
    updatedBy,
  };

  // Upload image to cloudinary
  const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
    folder: `E-commerce-40/${Product.collection.name}/${slug}`,
  });
  // Destructure the response from cloudinary and add it to the product data object
  const { secure_url, public_id } = cloudUpload;
  productData.mainImage = { secure_url, public_id };

  // Calculate final price and stock and add them to the product data object
  productData.finalPrice = price - discount;
  productData.stock = quantity - soldItems;

  // Create new product
  const newProduct = await Product.create(productData);

  // Send response
  res.status(201).json({
    status: "success",
    message: `Product added successfully`,
    data: newProduct,
  });
});

/**
 * update existing category
 */

const updateProduct = catchAsyncError(async (req, res, next) => {});

/**
 * Get all products from DB
 */
const getAllProducts = handleAll(Product, populateOptions);

/**
 * Get a specific product by its id from DB
 */
const getOneProduct = handleOne(Product, populateOptions);

/**
 * Delete a specific product by its id from DB
 */
const deleteOneProduct = handleOne(Product);

export {
  createProduct,
  updateProduct,
  getAllProducts,
  getOneProduct,
  deleteOneProduct,
};
