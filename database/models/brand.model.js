import mongoose from "mongoose";
import { ImageSchema } from "./image.model.js";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: ImageSchema,
  },
  {
    timestamps: true,
  }
);

export const Brand = mongoose.model("Brand", BrandSchema);
