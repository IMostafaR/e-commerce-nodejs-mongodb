import path from "path";
import { config } from "dotenv";
config({ path: path.resolve("../../../config/.env") });
import mongoose from "mongoose";
import { User } from "../../../database/models/user.model.js";
import { hashPassword } from "../../utils/password/passwordHashing.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

export const createAdmin = catchAsyncError(async () => {
  await mongoose.connect(process.env.DB_CONNECTION);
  console.log("Database connected:", mongoose.connections[0].name);
  const hashedPassword = hashPassword(process.env.ADMIN_PASS);

  const adminObj = {
    firstName: "Super",
    lastName: "Admin",
    email: process.env.EMAIL_ADDRESS,
    password: hashedPassword,
    role: "admin",
    verifiedEmail: true,
  };

  await User.create(adminObj);
  console.log("Admin account created successfully");
  mongoose.disconnect();
});

createAdmin();
