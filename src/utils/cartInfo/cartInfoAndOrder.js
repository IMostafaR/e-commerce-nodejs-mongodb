import { Cart } from "../../../database/models/cart.model.js";
import { Coupon } from "../../../database/models/coupon.model.js";
import { Product } from "../../../database/models/product.model.js";
import { AppError } from "../error/appError.js";

/**
 * @desc    Find product and calculate totalPrice for the cart and check stock (when adding product to cart or creating new cart)
 *
 * @param { String } productID
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
 * @desc    Get real time product price and update the cart if the price changed
 * @param { mongoose.Document } cart
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

  return cart;
};

/**
 * @desc    Get cart info for order (products, totalPrice, coupon) after updating the cart prices
 * @param {String} user
 * @returns
 */

const getCartInfoForOrder = async (user, next) => {
  // get cart of the user and get real time product prices
  const existingCart = await Cart.findOne({ user });

  if (!existingCart) return next(new AppError("Cart is empty", 404));

  let updatedCartPrices = await getRealTimeProductPrice(existingCart);
  updatedCartPrices = JSON.parse(JSON.stringify(updatedCartPrices));
  // updatedCartPrices = updatedCartPrices.toJSON();
  // Get product IDs from the cart
  const productIDs = updatedCartPrices.products.map(
    (cartItem) => cartItem.product
  );

  // Get products from database using the IDs
  const existingProducts = await Product.find({ _id: { $in: productIDs } });

  // Create an object to map product IDs to their names
  const productNames = {};
  // get product names from the existingProducts array
  existingProducts.forEach(
    (product) => (productNames[product._id] = product.name)
  );

  // Iterate through cart items and add product names to the product object in the products array
  updatedCartPrices.products.forEach((cartItem) => {
    cartItem.name = productNames[cartItem.product];
  });

  // create cart info object
  const cartInfo = {
    cart: updatedCartPrices._id,
    products: updatedCartPrices.products,
    totalPrice: updatedCartPrices.totalPrice,
  };
  // add coupon to cart info if it exists
  if (updatedCartPrices.coupon?.discount)
    cartInfo.coupon = updatedCartPrices.coupon;

  return cartInfo;
};

const updateRelatedDocsAfterOrder = async (
  couponCode,
  user,
  products,
  cartID
) => {
  // add userID to usedBy array in the coupon document
  if (couponCode) {
    await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $push: { usedBy: user } }
    );
  }

  // Create an object to map product IDs to their quantities
  const productQuantityMap = {};
  products.forEach((item) => {
    productQuantityMap[item.product] = item.quantity;
  });

  // Get the product IDs from the cart
  const productIDs = products.map((item) => item.product);

  // Create an array to store the update operations for each product
  const updateOperations = productIDs.map((productID) => {
    const quantityOrdered = productQuantityMap[productID];
    return {
      updateOne: {
        filter: { _id: productID },
        update: {
          $inc: {
            soldItems: quantityOrdered,
            stock: -quantityOrdered,
          },
        },
      },
    };
  });

  // Use bulkWrite to update all products
  await Product.bulkWrite(updateOperations);

  // delete cart after order
  await Cart.findByIdAndDelete(cartID);
};

export {
  findProductAndCalculate,
  getRealTimeProductPrice,
  getCartInfoForOrder,
  updateRelatedDocsAfterOrder,
};
