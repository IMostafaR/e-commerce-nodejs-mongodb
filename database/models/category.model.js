import mongoose from "mongoose";
import { Image } from "./image.model.js";

const CategorySchema = new mongoose.Schema(
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
    image: Image.schema,
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", CategorySchema);
