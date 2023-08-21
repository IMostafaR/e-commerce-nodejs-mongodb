import { User } from "../../../database/models/user.model.js";
import { hashPassword } from "../../utils/password/passwordHashing.js";

export const createAdmin = async () => {
  try {
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
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};
