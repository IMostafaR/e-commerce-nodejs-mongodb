import { catchAsyncError } from "../../utils/error/asyncError.js";
import { getAddress } from "../../utils/getAddress/getAddress.js";
import {
  getCartInfoForOrder,
  updateRelatedDocsAfterOrder,
} from "../../utils/cartInfo/cartInfoAndOrder.js";
import { Order } from "../../../database/models/order.model.js";
import { AppError } from "../../utils/error/appError.js";

/**
 * @desc    Create order for user
 */
const createCashOrder = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;
  const { addressID, paymentMethod } = req.body;

  // get address from user address array by address ID
  const address = await getAddress(user, addressID);
  // get cart info for order (products, totalPrice, coupon) after updating the cart prices
  const cartInfo = await getCartInfoForOrder(user, next);

  // create order
  const order = await Order.create({
    user,
    address,
    ...cartInfo,
    paymentMethod,
    status: "completed",
  });

  if (!order) return next(new AppError("Order could not be created", 500));

  // update related documents after order (usedBy array in coupon document, soldItems and stock in product document, delete cart document)
  await updateRelatedDocsAfterOrder(
    cartInfo.coupon?.code,
    user,
    cartInfo.products,
    cartInfo.cart
  );

  // send response
  return res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

export { createCashOrder };
