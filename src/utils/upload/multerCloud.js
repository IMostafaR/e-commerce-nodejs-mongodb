import multer from "multer";
import { AppError } from "../error/appError.js";

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/svg+xml"],
  text: ["application/pdf", "application/msword"],
};

export const uploadFileCloud = ({ fileType }) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (fileType.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new AppError("Unsupported file type", 415), false);
  };

  const upload = multer({ storage, fileFilter });

  return upload;
};
