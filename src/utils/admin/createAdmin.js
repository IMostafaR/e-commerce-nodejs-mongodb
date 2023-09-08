import path from "path";
import { config } from "dotenv";

config({ path: path.resolve("../../../config/.env") });
import mongoose from "mongoose";
import { User } from "../../../database/models/user.model.js";
import * as pass from "../password/passwordHashing.js";

(async () => {
  // establish DB connection
  await mongoose.connect(process.env.DB_CONNECTION);
  console.log("Database connected:", mongoose.connections[0].name);

  // hash admin login password
  const hashedPassword = pass.hash(process.env.ADMIN_PASS);

  // define admin data object
  const adminObj = {
    firstName: "Super",
    lastName: "Admin",
    email: process.env.EMAIL_ADDRESS,
    password: hashedPassword,
    role: "admin",
    verifiedEmail: true,
  };

  // add admin data to DB
  await User.create(adminObj);
  console.log("Admin account created successfully");

  // terminate DB connection
  mongoose.disconnect();
})();
