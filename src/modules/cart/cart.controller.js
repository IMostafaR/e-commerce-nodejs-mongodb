import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/product.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

// find product and calculate totalPrice for the cart
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
    data: newProductDataToCart,
  });
});

export { createCart };
