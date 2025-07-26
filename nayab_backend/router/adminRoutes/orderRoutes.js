const express = require('express');
const adminRouter = express.Router();
const orderController = require('../../controllers/userController/orderController');
const tokenValidate = require('../../middleware/tokenValidate');

// Admin order routes
adminRouter.get('/orders', tokenValidate, orderController.getAllOrders);
adminRouter.patch('/orders/:id/status', tokenValidate, orderController.updateOrderStatus);

module.exports = adminRouter; 