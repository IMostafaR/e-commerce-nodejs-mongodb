import { AppError } from "../error/appError.js";
import { catchAsyncError } from "../error/asyncError.js";

const deleteOne = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const deletedDoc = await model.findByIdAndDelete(id);

    if (!deletedDoc) return next(new AppError(`${id} cannot be found`, 404));

    res.status(200).json({
      status: "success",
      message: `${deletedDoc.name} successfully deleted`,
    });
  });
};

export { deleteOne };
