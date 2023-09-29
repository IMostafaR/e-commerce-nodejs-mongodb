import { Router } from "express";
import {
  addWishlist,
  deleteAllWishlist,
  deleteProductFromWishlist,
  getWishlist,
} from "./wishlist.controller.js";
import { authenticate } from "../auth/auth.controller.js";
import { validation } from "../../middleware/validation/validation.js";
import {
  addWishlistValidation,
  deleteAllWishlistValidation,
  deleteProductFromWishlistValidation,
  getWishlistValidation,
} from "./wishlist.validator.js";

export const wishlistRouter = Router();

wishlistRouter
  .route("/")
  .patch(validation(addWishlistValidation), authenticate, addWishlist)
  .get(validation(getWishlistValidation), authenticate, getWishlist)
  .put(
    validation(deleteProductFromWishlistValidation),
    authenticate,
    deleteProductFromWishlist
  )
  .delete(
    validation(deleteAllWishlistValidation),
    authenticate,
    deleteAllWishlist
  );
