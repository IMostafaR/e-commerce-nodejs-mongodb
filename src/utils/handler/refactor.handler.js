import { AppError } from "../error/appError.js";
import { catchAsyncError } from "../error/asyncError.js";

const getOne = (model, docName) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const existingDoc = await model.findById(id);

    if (!existingDoc)
      return next(new AppError(`${docName} with ID ${id} not found`, 404));

    res.status(200).json({
      status: "success",
      data: existingDoc,
    });
  });
};

const deleteOne = (model, docName) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const deletedDoc = await model.findByIdAndDelete(id);

    if (!deletedDoc)
      return next(new AppError(`${docName} with ID ${id} not found`, 404));

    res.status(200).json({
      status: "success",
      message: `${deletedDoc.name} successfully deleted`,
    });
  });
};

export { getOne, deleteOne };
