import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../error/appError.js";

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/svg+xml"],
  text: ["application/pdf", "application/msword"],
};

export const uploadFile = ({ folder, fileType }) => {
  const storage = multer.diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "__" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    console.log(file.mimetype.startsWith("image"));
    if (fileType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Unsupported file type", 415), false);
    }
  };

  const upload = multer({ storage, fileFilter });

  return upload;
};
