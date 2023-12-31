import { Cart } from "../../../database/models/cart.model.js";
import { Coupon } from "../../../database/models/coupon.model.js";
import {
  findProductAndCalculate,
  getRealTimeProductPrice,
} from "../../utils/cartInfo/cartInfoAndOrder.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

const populateOptions = {
  path: "products.product",
  select: "name mainImage.secure_url",
};

/**
 * @desc    Create cart for user and add products to it or update quantity of products in it if it already exists
 */
const addToCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;
  const { productID, quantity } = req.body;

  // check if cart already exists for the user
  const existingCart = await Cart.findOne({ user });

  // if cart does not exist for the user
  if (!existingCart) {
    const { price, productTotalPrice } = await findProductAndCalculate(
      productID,
      quantity,
      next
    );

    // create new cart
    const newCart = await Cart.create({
      user,
      products: [{ product: productID, quantity, price }],
      totalPriceWithoutDiscount: productTotalPrice,
      totalPrice: productTotalPrice,
    });

    // send response
    return res.status(201).json({
      status: "success",
      message: "Cart created successfully",
      totalItems: newCart.products.length,
      data: newCart,
    });
  }

  // if cart already exists for the user
  // check if the product already exists in the cart
  const existingProductInCart = existingCart.products.find(
    (item) => item.product == productID
  );

  // if product does not exist in the cart
  if (!existingProductInCart) {
    const { price, productTotalPrice } = await findProductAndCalculate(
      productID,
      quantity,
      next
    );

    // add product to cart
    const newProductToCart = await Cart.findByIdAndUpdate(
      existingCart._id,
      {
        $addToSet: {
          products: { product: productID, quantity, price },
        },
        $inc: {
          totalPriceWithoutDiscount: productTotalPrice,
          totalPrice: productTotalPrice,
        },
      },
      { new: true }
    );

    // send response
    return res.status(201).json({
      status: "success",
      message: "Product added to cart successfully",
      totalItems: newProductToCart.products.length,
      data: newProductToCart,
    });
  }

  // if product already exists in the cart
  const { productTotalPrice } = await findProductAndCalculate(
    productID,
    quantity + existingProductInCart.quantity,
    next
  );

  // calculate product old totalPrice and new totalPrice according to the product price and quantity
  const productOldTotalPrice =
    existingProductInCart.price * existingProductInCart.quantity;
  const productNewTotalPrice = productTotalPrice;

  // increment quantity and totalPrice of the product in the cart
  const newProductDataToCart = await Cart.findByIdAndUpdate(
    existingCart._id,

    {
      $inc: {
        "products.$[id].quantity": quantity,
        totalPriceWithoutDiscount: -productOldTotalPrice + productNewTotalPrice,
        totalPrice: -productOldTotalPrice + productNewTotalPrice,
      },
    },
    { arrayFilters: [{ "id.product": productID }], new: true }
  );

  // send response
  return res.status(200).json({
    status: "success",
    message: "Product quantity updated successfully",
    totalItems: newProductDataToCart.products.length,
    data: newProductDataToCart,
  });
});

/**
 * @desc    Get cart of user with all products in it with their updated prices
 */
const getCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;

  // Get cart of user from database
  const cart = await Cart.findOne({ user });

  // Check if the cart is empty or does not exist
  if (!cart) return next(new AppError("Cart is empty", 404));

  // update cart with real time product prices
  await getRealTimeProductPrice(cart);

  // Populate cart with product details
  const populatedCart = await Cart.findById(cart._id).populate(populateOptions);

  // Send response
  res.status(200).json({
    status: "success",
    totalItems: cart.products.length,
    data: populatedCart,
  });
});

/**
 * @desc    delete product from cart
 */

const deleteProductFromCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;
  const { productID } = req.body;

  // Delete product from cart
  const cart = await Cart.findOneAndUpdate(
    { user },
    {
      $pull: { products: { product: productID } }, // reference document
    },
    { new: true }
  ).populate(populateOptions);

  // Send response
  res.status(200).json({
    status: "success",
    message: "Product deleted from cart",
    totalItems: cart.products.length,
    data: cart,
  });
});

/**
 * @desc    delete user's cart
 */

const deleteCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;

  // Delete cart
  const deletedCart = await Cart.findOneAndDelete({ user });

  // check if there is no cart to delete
  if (!deletedCart)
    return next(new AppError("You don't have cart to be deleted", 404));

  // Send response
  res.status(200).json({
    status: "success",
    message: "Cart deleted successfully",
  });
});

/**
 * @desc    Apply coupon to cart
 */

const applyCouponToCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;
  const { couponCode } = req.body;
  // check if coupon exists
  const existingCoupon = await Coupon.findOne({ code: couponCode });
  if (!existingCoupon)
    return next(new AppError("Coupon does not exist, try again", 404));

  // check if the user already used this coupon
  if (existingCoupon.usedBy.includes(user))
    return next(new AppError("You already used this coupon", 400));

  // check if coupon is active, expired, or used max times
  if (
    !existingCoupon.active ||
    existingCoupon.expiresAt < Date.now() ||
    existingCoupon.usedBy.length > existingCoupon.maxUse
  )
    return next(new AppError("Coupon is expired", 400));

  // check if user applied coupon to his cart before
  const cart = await Cart.findOne({ user });
  if (cart.coupon?.code === existingCoupon.code)
    return next(new AppError("You already applied coupon to your cart", 400));

  // check if the coupon discount is greater than the totalPrice of the cart
  if (cart.totalPrice < existingCoupon.discount)
    return next(new AppError("This coupon is not valid for your cart", 400));

  // update cart with coupon details and calculate totalPrice for the cart
  const updatedCart = await Cart.findOneAndUpdate(
    { user },
    {
      coupon: { code: existingCoupon.code, discount: existingCoupon.discount },
      $inc: {
        totalPrice: -existingCoupon.discount,
      },
    },
    { new: true }
  ).populate(populateOptions);

  // send response
  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: updatedCart,
  });

  // updating the usedBy field in the coupon document will be done in the order controller after the order is created successfully and the user successfully paid for it
});

export {
  addToCart,
  getCart,
  deleteProductFromCart,
  deleteCart,
  applyCouponToCart,
};
