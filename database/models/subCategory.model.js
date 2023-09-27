import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [
        true,
        "There's already a subcategory with this name in the database",
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

SubcategorySchema.pre(/^find/, function () {
  this.populate({
    path: "createdBy updatedBy category",
    select: "_id name slug firstName lastName email role",
  });
});

export const Subcategory = mongoose.model("Subcategory", SubcategorySchema);
