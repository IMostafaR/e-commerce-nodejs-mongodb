import { Router } from "express";
import {
  addWishlist,
  deleteAllWishlist,
  deleteProductFromWishlist,
  getWishlist,
} from "./wishlist.controller.js";
import { authenticate } from "../auth/auth.controller.js";

export const wishlistRouter = Router();

wishlistRouter
  .route("/")
  .patch(authenticate, addWishlist)
  .get(authenticate, getWishlist)
  .put(authenticate, deleteProductFromWishlist)
  .delete(authenticate, deleteAllWishlist);
