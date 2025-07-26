const express = require('express');
const adminRouter = express.Router();
const tokenValidate = require('../../middleware/tokenValidate');
const requireAdmin = require('../../middleware/requireAdmin');
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../../controllers/adminController/categoryController');

// Get all categories
adminRouter.get('/categories', tokenValidate, requireAdmin, getAllCategories);
// Create a new category
adminRouter.post('/categories', tokenValidate, requireAdmin, createCategory);
// Update a category
adminRouter.put('/categories/:id', tokenValidate, requireAdmin, updateCategory);
// Delete a category
adminRouter.delete('/categories/:id', tokenValidate, requireAdmin, deleteCategory);

module.exports = adminRouter; 