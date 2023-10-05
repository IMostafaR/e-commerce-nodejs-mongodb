import { Product } from "../../../database/models/product.model.js";
import { AppError } from "../error/appError.js";

/**
 * @desc    Find product and calculate totalPrice for the cart and check stock (when adding product to cart or creating new cart)
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
 * @desc get real time product price
 */
const getRealTimeProductPrice = async (cart) => {
  // Get product IDs from the cart
  const productIDs = cart.products.map((cartItem) => cartItem.product);

  // Get products from database using the IDs
  const products = await Product.find({ _id: { $in: productIDs } });

  // Create an object to map product IDs to their prices
  const productPrices = {};

  // get product prices from the products array
  products.forEach(
    (product) => (productPrices[product._id.toString()] = product.finalPrice)
  );

  // Set a flag to check if the cart needs to be updated
  let cartNeedsUpdate = false;

  // Iterate through cart items and update prices if the product price changed
  cart.products.forEach((cartItem) => {
    if (cartItem.price != productPrices[cartItem.product]) {
      cartItem.price = productPrices[cartItem.product];
      cartNeedsUpdate = true;
    }
  });

  // If the cart was updated, recalculate the totalPriceWithoutDiscount and totalPrice
  if (cartNeedsUpdate) {
    cart.totalPriceWithoutDiscount = 0;
    cart.totalPrice = 0;

    cart.products.forEach((cartItem) => {
      cart.totalPriceWithoutDiscount += cartItem.price * cartItem.quantity;
      cart.totalPrice += cartItem.price * cartItem.quantity;
    });

    // Check if there is a coupon applied to the cart and update the totalPrice if the totalPrice is greater than the coupon discount
    if (cart.coupon?.discount && cart.totalPrice > cart.coupon?.discount) {
      cart.totalPrice -= cart.coupon.discount;
    }

    await cart.save();
  }
};

export { findProductAndCalculate, getRealTimeProductPrice };
