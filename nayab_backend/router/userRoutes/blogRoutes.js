const express = require('express');
const userRouter = express.Router();

const { getAllBlogs, getBlogById } = require('../../controllers/userController/blogController');

// User-facing blog routes
userRouter.get('/blogs', getAllBlogs);
userRouter.get('/blogs/:id', getBlogById);

module.exports = userRouter;
