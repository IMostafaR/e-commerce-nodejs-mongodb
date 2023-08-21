import mongoose from "mongoose";
import { User } from "../../../database/models/user.model.js";

export const createAdmin = async () => {
  try {
    const adminObj = {
      firstName: "Super",
      lastName: "Admin",
      email: `${process.env.EMAIL_ADDRESS}`,
      password: `${process.env.ADMIN_PASS}`,
      role: "admin",
      verifiedEmail: true,
    };

    await User.create(adminObj);
    console.log("Admin account created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

createAdmin();

const obj = {
  email: `${process.env.EMAIL_ADDRESS}`,
  password: `${process.env.ADMIN_PASS}`,
};
const obj2 = {
  email: process.env.EMAIL_ADDRESS,
  password: process.env.ADMIN_PASS,
};
