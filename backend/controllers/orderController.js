// backend/controllers/orderController.js

import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    // Make sure every item has all the required fields from our model
    const order = new Order({
      orderItems: orderItems.map(item => ({
        ...item,
        product: item.product, // The ID of the product
        // Ensure name, qty, image, and price are all present
      })),
      user: req.user._id, // From the protect middleware
      shippingAddress,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

export { addOrderItems, getMyOrders };