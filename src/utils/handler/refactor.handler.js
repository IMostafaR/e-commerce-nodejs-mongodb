import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import cloudinary from "../../utils/cloud/cloud.js";
import { AppError } from "../error/appError.js";
import { catchAsyncError } from "../error/asyncError.js";
import { APIFeatures } from "../apiFeature/apiFeature.js";

/**
 * create new document
 */
const createOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { name } = req.body;

    const existingDoc = await model.findOne({ name });

    if (existingDoc) {
      return next(new AppError(`${model.modelName} already exists`, 409));
    }

    const slug = slugify(name);

    const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `E-commerce-40/${model.collection.name}/${slug}`,
    });

    const { secure_url, public_id } = cloudUpload;

    const newDoc = await model.create({
      name,
      slug,
      image: { secure_url, public_id },
    });

    res.status(201).json({
      status: "success",
      message: `${model.modelName} added successfully`,
      data: newDoc,
    });
  });
};

/**
 * update existing document
 */
const updateOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const existingDoc = await model.findById(id);

    if (!existingDoc) {
      return next(
        new AppError(
          `Sorry, the ${model.modelName} with id ${id}  cannot be found`,
          404
        )
      );
    }
    // TODO: update name and slug
    // TODO: when updating name and slug, you should also update folders names in clouninary
    if (req.file) {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        public_id: existingDoc.image.public_id,
      });

      existingDoc.image.secure_url = secure_url;
    }

    const updatedDoc = await existingDoc.save();

    res.status(200).json({
      status: "success",
      message: `${model.modelName} image updated successfully`,
      data: updatedDoc,
    });
  });
};

/**
 * Middleware for handling requests to list documents of a specific model.
 *
 * @param {mongoose.Model} model - The Mongoose model to query documents from.
 * @returns {Function} - An Express middleware function for handling the request.
 *
 * @throws {AppError} - If no documents are found, it may throw errors based on the situation:
 *   - 404 Not Found: If a category or page is not found.
 *   - 404 Not Found: If no documents of the specified model exist.
 */
const handleAll = (model) => {
  return catchAsyncError(async (req, res, next) => {
    // Create an empty query object
    let queryObj = {};

    // If a category ID is provided in the request params, add it to the query
    req.params && req.params.id ? (queryObj.category = req.params.id) : null;

    // Create an APIFeatures instance to apply pagination, filtering, sorting, search, and selection
    let features = new APIFeatures(model.find(queryObj), req.query)
      .pagination()
      .filter()
      .sort()
      .search()
      .select();

    // Execute the Mongoose query
    const doc = await features.mongooseQuery;

    // Handle cases where no documents are found
    if (!doc.length)
      return req.params && req.params.id
        ? (await Category.findById(req.params.id))
          ? next(
              new AppError("Subcategories are not found for this category", 404)
            )
          : next(
              new AppError(
                "No such category with this id exists in the DB",
                404
              )
            )
        : features.page // for pagination
        ? next(new AppError(`Page not found`, 404)) // for pagination
        : next(
            new AppError(
              `There's no ${model.modelName} added to the DB yet.`,
              404
            )
          );

    // Send the response with the retrieved documents
    res.status(200).json({
      status: "success",
      page: features.page,
      limit: features.limit,
      total: doc.length,
      data: doc,
    });
  });
};

/**
 * Delete or Get a specific document by its id from DB
 */
const handleOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let doc;

    if (req.method === "GET") {
      doc = await model.findById(id);
    } else if (req.method === "DELETE") {
      doc = await model.findByIdAndDelete(id);
    }

    if (!doc)
      return next(
        new AppError(`${model.modelName} with ID ${id} not found`, 404)
      );

    if (req.method === "GET") {
      return res.status(200).json({
        status: "success",
        data: doc,
      });
    } else if (req.method === "DELETE") {
      return res.status(200).json({
        status: "success",
        message: `${doc.name} successfully deleted`,
      });
    }
  });
};

export { createOne, updateOne, handleAll, handleOne };