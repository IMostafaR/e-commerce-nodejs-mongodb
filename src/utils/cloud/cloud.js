import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve("config/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
