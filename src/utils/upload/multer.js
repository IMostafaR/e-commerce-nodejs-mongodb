import multer from "multer";

export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      console.log(file);
    },
  });

  const upload = multer({ storage });

  return upload;
};
