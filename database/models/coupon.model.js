import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUse: {
      type: Number,
      required: true,
    },
    usedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
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

export const Coupon = mongoose.model("Coupon", CouponSchema);
