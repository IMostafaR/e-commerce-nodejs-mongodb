/**
 * Creates a Super Admin account in the database.
 *
 * This module is intended for creating a Super Admin account with predefined values.
 * It should be used for initial setup and testing purposes.
 *
 * Note: This module is now deprecated and replaced with the createUser function
 * in the user controller. It is left here for legacy purposes.
 *
 * Important: Make sure to customize the `adminObj` data for each admin account
 * created using this module.
 *
 * @module createAdmin
 */

import path from "path";
import { config } from "dotenv";

config({ path: path.resolve("../../../config/.env") });
import mongoose from "mongoose";
import { User } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";

(async () => {
  /**
   * Establish a connection to the database.
   *
   * @function
   * @async
   */
  await mongoose.connect(process.env.DB_CONNECTION);
  console.log("Database connected:", mongoose.connections[0].name);

  // hash admin login password
  const hashedPassword = bcrypt.hashSync(
    process.env.ADMIN_PASS,
    Number(process.env.SALT_ROUNDS)
  );

  /**
   * Data for creating the Super Admin account.
   *
   * @type {Object}
   * @property {string} firstName - The first name of the Super Admin.
   * @property {string} lastName - The last name of the Super Admin.
   * @property {string} email - The email address of the Super Admin.
   * @property {string} password - The hashed password of the Super Admin.
   * @property {string} role - The role of the Super Admin (e.g., "admin").
   * @property {boolean} verifiedEmail - Indicates whether the email is verified (true/false).
   */
  const adminObj = {
    firstName: "Super",
    lastName: "Admin",
    email: process.env.EMAIL_ADDRESS,
    password: hashedPassword,
    role: "admin",
    verifiedEmail: true,
  };

  /**
   * Add the Super Admin data to the database.
   *
   * @function
   * @async
   */
  await User.create(adminObj);
  console.log("Admin account created successfully");

  /**
   * Terminate the database connection.
   *
   * @function
   * @async
   */
  await mongoose.disconnect();
  console.log("Database connection terminated ⚠️");
})();
