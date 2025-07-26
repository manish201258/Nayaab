const express = require('express');
const userRouter = express.Router();
const orderController = require('../../controllers/userController/orderController');
const tokenValidate = require('../../middleware/tokenValidate');

// User order routes
userRouter.post('/checkout',tokenValidate, orderController.checkout);
userRouter.get('/orders/my',tokenValidate, orderController.getUserOrders);
userRouter.get('/orders/:id',tokenValidate, orderController.getOrderById);
userRouter.patch('/orders/:id/cancel',tokenValidate, orderController.cancelOrder);

module.exports = userRouter; 