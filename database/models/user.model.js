import mongoose from "mongoose";
import { ImageSchema } from "./image.model.js";
import bcrypt from "bcrypt";

// AddressSchema will be embedded into UserSchema

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: Number,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  defaultAddress: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      min: 2,
      max: 16,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      min: 2,
      max: 16,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already registered"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password is too short"],
    },
    phone: {
      type: String,
      trim: true,
    },
    profilePic: ImageSchema,
    address: {
      type: [AddressSchema],
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    deactivated: {
      type: Boolean,
      default: false,
    },
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
    },
    resetPassCode: {
      type: String,
      trim: true,
    },
    jwtSecretKey: {
      type: mongoose.Schema.Types.Buffer,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(
      this.password,
      Number(process.env.SALT_ROUNDS)
    );
  }
});

UserSchema.pre("findOneAndUpdate" || "findByIdAndUpdate", function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(
      this._update.password,
      Number(process.env.SALT_ROUNDS)
    );
  }
});

export const User = mongoose.model("User", UserSchema);
