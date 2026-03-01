// backend/models/orderModel.js

import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true }, // <-- Crucial field
        image: { type: String, required: true },
        price: { type: Number, required: true }, // <-- Crucial field
        product: { // <-- Crucial reference to the original product
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    deliveryStatus: { type: String, required: true, default: 'Processing' }, // For the tracker
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;