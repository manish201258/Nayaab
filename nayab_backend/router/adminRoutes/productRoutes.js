const express = require('express');
const adminRouter = express.Router();
const upload = require('../../middleware/upload');
const tokenValidate = require('../../middleware/tokenValidate');
const requireAdmin = require('../../middleware/requireAdmin');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../../controllers/adminController/productController');

// Get all products
adminRouter.get('/products', tokenValidate, requireAdmin, getAllProducts);
// Get a single product by ID
adminRouter.get('/products/:id', tokenValidate, requireAdmin, getProductById);
// Create a new product (multiple images allowed)
adminRouter.post('/products', tokenValidate, requireAdmin, upload.array('images', 10), createProduct);
// Update a product (multiple images allowed)
adminRouter.put('/products/:id', tokenValidate, requireAdmin, upload.array('images', 10), updateProduct);
// Delete a product
adminRouter.delete('/products/:id', tokenValidate, requireAdmin, deleteProduct);

module.exports = adminRouter;
