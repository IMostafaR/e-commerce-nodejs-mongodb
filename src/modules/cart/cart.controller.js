import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/product.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

const populateOptions = {
  path: "products.product",
  select: "name mainImage.secure_url",
};

/**
 * @desc    Find product and calculate totalPrice for the cart
 *
 * @param { ObjectId } productID
 * @param {Number} quantity
 * @param {Express.NextFunction} next
 * @returns {Object} price and productTotalPrice
 */
const findProductAndCalculate = async (productID, quantity, next) => {
  // get product details
  const product = await Product.findById(productID);
  // check if product stock is less than the quantity requested
  if (product.stock < quantity)
    return next(new AppError("Quantity exceeds stock", 400));

  // calculate totalPrice for the cart according to the product price and quantity
  const price = product.finalPrice;
  const productTotalPrice = price * quantity;

  return { price, productTotalPrice };
};

/**
 * @desc    Create cart for user and add products to it or update quantity of products in it if it already exists
 */
const createCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;
  const { productID, quantity } = req.body;

  // check if cart already exists for the user
  const existingCart = await Cart.findOne({ user });

  // if cart does not exist for the user
  if (!existingCart) {
    const priceData = await findProductAndCalculate(productID, quantity, next);

    // create new cart
    const newCart = await Cart.create({
      user,
      products: [{ product: productID, quantity, price: priceData.price }],
      totalPrice: priceData.productTotalPrice,
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
    const priceData = await findProductAndCalculate(productID, quantity, next);

    // add product to cart
    const newProductToCart = await Cart.findByIdAndUpdate(
      existingCart._id,
      {
        $addToSet: {
          products: { product: productID, quantity, price: priceData.price },
        },
        $inc: { totalPrice: priceData.productTotalPrice },
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
  const priceData = await findProductAndCalculate(
    productID,
    quantity + existingProductInCart.quantity,
    next
  );

  // calculate product old totalPrice and new totalPrice according to the product price and quantity
  const productOldTotalPrice =
    existingProductInCart.price * existingProductInCart.quantity;
  const productNewTotalPrice = priceData.productTotalPrice;

  // increment quantity and totalPrice of the product in the cart
  const newProductDataToCart = await Cart.findByIdAndUpdate(
    existingCart._id,

    {
      $inc: {
        "products.$[id].quantity": quantity,
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
 * @desc    Get cart of user with all products in it and their details populated
 */
const getCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;

  // get cart of user from database and populate it with product details
  const cart = await Cart.findOne({ user }).populate({
    path: "products.product",
    select: "name mainImage.secure_url",
  });

  // check if cart is empty or not and send response accordingly
  if (!cart) return next(new AppError("Cart is empty", 404));

  // send response
  res.status(200).json({
    status: "success",
    data: cart,
  });
});

export { createCart, getCart };
