const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Assuming you have a Product model
          required: true,
        },
        name: { type: String, required: true }, // Snapshot of product name
        price: { type: Number, required: true }, // Snapshot of price at time of order
        qty: { type: Number, required: true, min: 1 },
        image: { type: String }, // Snapshot of image URL
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      tag: { type: String, enum: ['home', 'hostel', 'office', 'other'], default: 'home' }, // Tag from selected address
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['credit-card', 'paypal', 'bank-transfer', 'cod', 'upi', 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
