const express = require('express');
const userRouter = express.Router();
const { getAllProducts, getProductById } = require('../../controllers/userController/productController');

// GET /api/user/products - get all published/active products
userRouter.get('/products', getAllProducts);

// GET /api/user/products/:id - get a single published/active product by ID
userRouter.get('/products/:id', getProductById);

module.exports = userRouter;
