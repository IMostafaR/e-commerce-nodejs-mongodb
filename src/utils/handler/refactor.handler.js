import { AppError } from "../error/appError.js";
import { catchAsyncError } from "../error/asyncError.js";

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

export { handleOne };
