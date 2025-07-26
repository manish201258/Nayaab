const Order = require('../../models/orders');
const Product = require('../../models/producs');
const Cart = require('../../models/cart');
const asyncHandler = require('express-async-handler');
const { sendMail } = require('../../lib/mailer');
const mongoose = require('mongoose');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, totalAmount, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items.' });
  }
  const order = new Order({
    user: req.user._id,
    items,
    shippingAddress,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod && paymentMethod.toLowerCase() !== 'cod' ? 'paid' : 'pending',
    orderStatus: 'processing',
  });
  const createdOrder = await order.save();

  // Well-formatted order placed email
  if (req.user && req.user.email) {
    let html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #B8956A;">Thank you for your order, ${req.user.name || 'Customer'}!</h2>
        <p>Your order has been placed successfully.</p>
        <table style="margin: 16px 0; border-collapse: collapse;">
          <tr><td><b>Order ID:</b></td><td>#${createdOrder._id.toString().slice(-6).toUpperCase()}</td></tr>
          <tr><td><b>Status:</b></td><td>${createdOrder.orderStatus.charAt(0).toUpperCase() + createdOrder.orderStatus.slice(1)}</td></tr>
          <tr><td><b>Total:</b></td><td>₹${createdOrder.totalAmount.toFixed(2)}</td></tr>
        </table>
        <h3 style="margin-top:24px;">Order Items:</h3>
        <ul>
          ${createdOrder.items.map(item => `
            <li>
              <b>${item.name}</b> (Qty: ${item.qty}) - ₹${item.price} each
            </li>
          `).join('')}
        </ul>
        <p style="margin-top:24px;">We will notify you as your order progresses.<br/>Thank you for shopping with us!</p>
        <hr style="margin:24px 0;"/>
        <p style="font-size:12px; color:#888;">If you have any questions, reply to this email.</p>
      </div>
    `;
    sendMail({
      to: req.user.email,
      subject: `Order Placed: #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
      html,
    }).catch(console.error);
  }
  res.status(201).json(createdOrder);
});

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders/my
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get a single order by ID (user can only access their own)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
});

// @desc    Cancel an order (only if not shipped/delivered)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  // Get the order owner's id as a string (works for both populated and unpopulated)
  let orderUserId;
  if (order.user && typeof order.user === 'object') {
    orderUserId = order.user._id ? order.user._id.toString() : order.user.id ? order.user.id.toString() : order.user.toString();
  } else {
    orderUserId = order.user.toString();
  }

  let cancelledBy = 'user';
  if (req.user && orderUserId !== req.user.id.toString()) {
    cancelledBy = 'admin';
  }

  // Only allow user to cancel their own order, or admin to cancel any order
  if (cancelledBy === 'user' && orderUserId !== req.user.id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
    return res.status(400).json({ message: "Order cannot be cancelled." });
  }
  order.orderStatus = 'cancelled';
  order.cancelledBy = cancelledBy;
  await order.save();

  // Well-formatted cancel email with who cancelled
  if (order.user && order.user.email) {
    let who = cancelledBy === 'admin'
      ? 'The seller (Nayab co.) cancelled your order. Please contact customer support.'
      : 'You cancelled your order. Your cancellation request has been accepted.';
    let html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #B8956A;">Order Cancelled</h2>
        <p>Dear ${order.user.name || 'Customer'},</p>
        <p>${who}</p>
        <table style="margin: 16px 0; border-collapse: collapse;">
          <tr><td><b>Order ID:</b></td><td>#${order._id.toString().slice(-6).toUpperCase()}</td></tr>
          <tr><td><b>Total:</b></td><td>₹${order.totalAmount.toFixed(2)}</td></tr>
        </table>
        <h3 style="margin-top:24px;">Order Items:</h3>
        <ul>
          ${order.items.map(item => `
            <li>
              <b>${item.name}</b> (Qty: ${item.qty}) - ₹${item.price} each
            </li>
          `).join('')}
        </ul>
        <p style="margin-top:24px;">If you have any questions, reply to this email.</p>
        <hr style="margin:24px 0;"/>
        <p style="font-size:12px; color:#888;">Thank you for considering us.<br/>- Nayab co.</p>
      </div>
    `;
    sendMail({
      to: order.user.email,
      subject: `Order Cancelled: #${order._id.toString().slice(-6).toUpperCase()}`,
      html,
    }).catch(console.error);
  }
  res.json(order);
});

// @desc    Checkout: create order from cart or direct buy
// @route   POST /api/orders/checkout
// @access  Private
const checkout = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, no user session found.' });
    }

    let { items, shippingAddress, paymentMethod } = req.body;
    let orderItems = [];
    let totalAmount = 0;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items to order.' });
    }

    // Validate all products and stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        image: product.images?.[0] || '',
      });
      totalAmount += product.price * item.qty;
    }

    // Update stock for all products
    for (const item of items) {
      const product = await Product.findById(item.product);
      product.stock -= item.qty;
      await product.save();
    }

    // Ensure shippingAddress is a full object matching the schema
    if (!shippingAddress || typeof shippingAddress !== 'object' || !shippingAddress.fullName) {
      shippingAddress = {
        fullName: (req.user && req.user.name) ? req.user.name : 'User',
        street: 'Sharma PG near ryan international school',
        city: 'Jaipur',
        state: 'Rajasthan',
        zip: '302022',
        country: 'India',
        tag: 'home'
      };
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method required.' });
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod && paymentMethod.toLowerCase() !== 'cod' ? 'paid' : 'pending',
      orderStatus: 'processing',
    });
    const createdOrder = await order.save();

    // Well-formatted order placed email
    if (req.user && req.user.email) {
      let html = `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #B8956A;">Thank you for your order, ${req.user.name || 'Customer'}!</h2>
          <p>Your order has been placed successfully.</p>
          <table style="margin: 16px 0; border-collapse: collapse;">
            <tr><td><b>Order ID:</b></td><td>#${createdOrder._id.toString().slice(-6).toUpperCase()}</td></tr>
            <tr><td><b>Status:</b></td><td>${createdOrder.orderStatus.charAt(0).toUpperCase() + createdOrder.orderStatus.slice(1)}</td></tr>
            <tr><td><b>Total:</b></td><td>₹${createdOrder.totalAmount.toFixed(2)}</td></tr>
          </table>
          <h3 style="margin-top:24px;">Order Items:</h3>
          <ul>
            ${createdOrder.items.map(item => `
              <li>
                <b>${item.name}</b> (Qty: ${item.qty}) - ₹${item.price} each
              </li>
            `).join('')}
          </ul>
          <p style="margin-top:24px;">We will notify you as your order progresses.<br/>Thank you for shopping with us!</p>
          <hr style="margin:24px 0;"/>
          <p style="font-size:12px; color:#888;">If you have any questions, reply to this email.</p>
        </div>
      `;
      sendMail({
        to: req.user.email,
        subject: `Order Placed: #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
        html,
      }).catch(console.error);
    }

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// --- Admin Endpoints ---
// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.orderStatus = status;
  await order.save();

  // Well-formatted status update email
  if (order.user && order.user.email) {
    let html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #B8956A;">Order Status Updated</h2>
        <p>Dear ${order.user.name || 'Customer'},</p>
        <p>Your order <b>#${order._id.toString().slice(-6).toUpperCase()}</b> status has been updated to:</p>
        <p style="font-size:18px;"><b>${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</b></p>
        <table style="margin: 16px 0; border-collapse: collapse;">
          <tr><td><b>Total:</b></td><td>₹${order.totalAmount.toFixed(2)}</td></tr>
        </table>
        <h3 style="margin-top:24px;">Order Items:</h3>
        <ul>
          ${order.items.map(item => `
            <li>
              <b>${item.name}</b> (Qty: ${item.qty}) - ₹${item.price} each
            </li>
          `).join('')}
        </ul>
        <hr style="margin:24px 0;"/>
        <p style="font-size:12px; color:#888;">If you have any questions, reply to this email.</p>
      </div>
    `;
    sendMail({
      to: order.user.email,
      subject: `Your Order #${order._id.toString().slice(-6).toUpperCase()} Status Updated`,
      html,
    }).catch(console.error);
  }
  res.json(order);
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  checkout,
  getAllOrders,
  updateOrderStatus,
};
