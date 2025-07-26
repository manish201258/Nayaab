const express = require('express');
const adminRouter = express.Router();
const upload = require('../../middleware/upload');
const tokenValidate = require('../../middleware/tokenValidate');
const requireAdmin = require('../../middleware/requireAdmin');

// Import blog controller
const { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById } = require('../../controllers/adminController/blogController');

// Blog routes
adminRouter.get('/blogs', tokenValidate, requireAdmin, getAllBlogs);
adminRouter.get('/blogs/:id', tokenValidate, requireAdmin, getBlogById);
adminRouter.post('/blogs', tokenValidate, requireAdmin, upload.single('featuredImage'), createBlog);
adminRouter.put('/blogs/:id', tokenValidate, requireAdmin, upload.single('featuredImage'), updateBlog);
adminRouter.delete('/blogs/:id', tokenValidate, requireAdmin, deleteBlog);

module.exports = adminRouter;
