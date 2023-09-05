import { AppError } from "../error/appError.js";
import { catchAsyncError } from "../error/asyncError.js";

const handleAll = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const queryObj = {};
    req.params && req.params.id ? (queryObj.category = req.params.id) : null;

    const doc = await model.find(queryObj);

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
        : next(
            new AppError(
              `There's no ${model.modelName} added to the DB yet.`,
              404
            )
          );

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

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

export { handleAll, handleOne };
