import mongoose from "mongoose";
import { ImageSchema } from "./image.model.js";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [
        true,
        "There's already a category with this name in the database",
      ],
      required: [true, "Category name is required"],
      trim: true,
      minLength: [2, "Category name is too short"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    image: { type: ImageSchema, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", CategorySchema);
