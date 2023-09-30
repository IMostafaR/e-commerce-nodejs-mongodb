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
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
