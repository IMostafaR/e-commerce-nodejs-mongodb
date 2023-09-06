import slugify from "slugify";
import { catchAsyncError } from "../../utils/error/asyncError.js";
import cloudinary from "../../utils/cloud/cloud.js";
import { Product } from "../../../database/models/product.model.js";
import { handleAll, handleOne } from "../../utils/handler/refactor.handler.js";

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

  const slug = slugify(name);

  const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
    folder: `E-commerce-40/${Product.collection.name}/${slug}`,
  });
  const { secure_url, public_id } = cloudUpload;

  const priceAfterDiscount = price - discount;

  const stock = quantity - soldItems;

  const newProduct = await Product.create({
    name,
    slug,
    mainImage: { secure_url, public_id },
    description,
    price,
    discount,
    priceAfterDiscount,
    quantity,
    stock,
    soldItems,
    category,
    subcategory,
    brand,
  });

  res.status(201).json({
    status: "success",
    message: `Product added successfully`,
    data: newProduct,
  });
});

/**
 * Get all categories from DB
 */
const getAllProducts = handleAll(Product);

/**
 * Get a specific category by its id from DB
 */
const getOneProduct = handleOne(Product);

/**
 * Delete a specific product by its id from DB
 */
const deleteOneProduct = handleOne(Product);

export { createProduct, getAllProducts, getOneProduct, deleteOneProduct };
