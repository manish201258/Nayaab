const express = require('express');
const userRouter = express.Router();

const { getUserProfile, updateUserDetails } = require('../../controllers/userController/userController'); // Adjust path to your controller file
const authMiddleware = require('../../middleware/tokenValidate'); // Assuming you have an auth middleware for protected routes (e.g., JWT verification)
const categoryRoutes = require('./categoryRoutes');
const commentRoutes = require('./commentRoutes');

// User-facing profile routes

// @desc    Get user profile
// @route   GET /api/user/:id
// @access  Private (authenticated user)
userRouter.get('/profile/:id', authMiddleware, getUserProfile);

// @desc    Update user details (including addresses)
// @route   PATCH /api/user/:id
// @access  Private (authenticated user)
userRouter.patch('/profile/:id', authMiddleware, updateUserDetails);

userRouter.use('/categories', categoryRoutes);
userRouter.use('/', commentRoutes);

module.exports = userRouter;
