import { catchAsyncError } from "../../utils/error/asyncError.js";
import { getAddress } from "../../utils/getAddress/getAddress.js";
import {
  getCartInfoForOrder,
  updateRelatedDocsAfterOrder,
} from "../../utils/cartInfo/cartInfoAndOrder.js";
import { Order } from "../../../database/models/order.model.js";
import { AppError } from "../../utils/error/appError.js";
import Stripe from "stripe";
import { Cart } from "../../../database/models/cart.model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

const getAllUserOrders = catchAsyncError(async (req, res, next) => {
  const { id: user } = req.user;

  const orders = await Order.find({ user });

  if (!orders)
    return next(new AppError("You don't have any order history", 404));

  return res.status(200).json({
    status: "success",
    data: orders,
  });
});

/**
 * @desc    Online payment
 */

const createOnlinePaymentSession = catchAsyncError(async (req, res, next) => {
  const { id: user, name, email } = req.user;
  const { addressID, paymentMethod } = req.body;

  // get address from user address array by address ID
  const address = await getAddress(user, addressID);
  // get cart info for order (products, totalPrice, coupon) after updating the cart prices
  const cartInfo = await getCartInfoForOrder(user, next);

  // create stripe session for online payment and send it to the client to complete the payment process
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: cartInfo.totalPrice * 100,
          product_data: {
            name: `Order from E-commerce. Customer: ${name}`,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL_SUCCESS}`,
    cancel_url: `${process.env.CLIENT_URL_CANCEL}`,
    customer_email: email,
    client_reference_id: cartInfo.cart,
    metadata: address,
  });

  // send response
  return res.status(200).json({
    status: "success",
    message: "Session created successfully",
    data: session,
  });
});

const paymentListenerAndCreateOrder = catchAsyncError(
  async (request, response, next) => {
    const sig = request.headers["stripe-signature"].toString();

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("successful payment ✨✨✨");
      const { client_reference_id: cartID, metadata: address } = session;
      const cart = await Cart.findById(cartID);
      const orderInfo = {
        user: cart.user,
        address,
        cart: cartID,
        products: cart.products,
        totalPrice: cart.totalPrice,
        status: "completed",
        paymentMethod: "card",
      };

      if (cart.coupon?.discount) orderInfo.coupon = cart.coupon;

      // create order
      const order = await Order.create(orderInfo);

      if (!order) return next(new AppError("Order could not be created", 500));

      // update related documents after order (usedBy array in coupon document, soldItems and stock in product document, delete cart document)
      await updateRelatedDocsAfterOrder(
        orderInfo.coupon?.code,
        orderInfo.user,
        orderInfo.products,
        orderInfo.cart
      );

      // send response
      return res.status(201).json({
        status: "success",
        message: "Order created successfully",
        data: order,
      });
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
  }
);

export {
  createCashOrder,
  getAllUserOrders,
  createOnlinePaymentSession,
  paymentListenerAndCreateOrder,
};
