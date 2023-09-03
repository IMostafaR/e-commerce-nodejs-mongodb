import mongoose from "mongoose";
import { ImageSchema } from "./image.model.js";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "There's already a brand with this name in the database"],
      required: [true, "Brand name is required"],
      trim: true,
      minLength: [2, "Brand name is too short"],
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
