import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [
        true,
        "There's already a subcategory with this same name in the database",
      ],
      required: [true, "Subcategory name is required"],
      trim: true,
      minLength: [2, "Subcategory name is too short"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subcategory = mongoose.model("Subcategory", SubcategorySchema);
