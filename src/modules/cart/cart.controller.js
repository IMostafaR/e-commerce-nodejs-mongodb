import { Cart } from "../../../database/models/cart.model.js";
import { Product } from "../../../database/models/product.model.js";
import { catchAsyncError } from "../../utils/error/asyncError.js";

const createCart = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;
  const { productID, quantity } = req.body;

  // check if cart already exists for the user
  const existingCart = await Cart.findOne({ user });

  // if cart does not exist for the user
  if (!existingCart) {
    // get product details
    const product = await Product.findById(productID);

    const price = product.finalPrice;

    // calculate totalPrice for the cart according to the product price and quantity
    const totalPrice = price * quantity;

    // create new cart
    const newCart = await Cart.create({
      user,
      products: [{ product: productID, quantity, price }],
      totalPrice,
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
    // get product details
    const product = await Product.findById(productID);

    const price = product.finalPrice;

    // calculate ProductTotalPrice to be incremented to the totalPrice in cart according to the product price and quantity
    const ProductTotalPrice = price * quantity;

    // add product to cart
    const newProductToCart = await Cart.findByIdAndUpdate(
      existingCart._id,
      {
        $addToSet: { products: { product: productID, quantity, price } },
        $inc: { totalPrice: ProductTotalPrice },
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
  // get product details to get the up to date price
  const product = await Product.findById(productID);

  // calculate product old totalPrice and new totalPrice according to the product price and quantity
  const productOldTotalPrice =
    existingProductInCart.price * existingProductInCart.quantity;
  const productNewTotalPrice =
    product.finalPrice * (quantity + existingProductInCart.quantity);

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
