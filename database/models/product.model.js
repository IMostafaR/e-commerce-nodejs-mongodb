import mongoose from "mongoose";
import { ImageSchema } from "./image.model.js";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minLength: [2, "Product name is too short"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    mainImage: { type: ImageSchema, required: true },

    images: [ImageSchema],
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, "Description is too short"],
      maxLength: [200, "Description is too long"],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    soldItems: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      min: 1,
      max: 5,
    },
    rateCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Subcategory",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
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

export const Product = mongoose.model("Product", ProductSchema);
