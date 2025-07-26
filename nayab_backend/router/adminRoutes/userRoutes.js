const express = require('express');
const adminRouter = express.Router();
const tokenValidate = require('../../middleware/tokenValidate');
const requireAdmin = require('../../middleware/requireAdmin');
const { getAllUsers, updateUser, blockUser, deleteUser } = require('../../controllers/adminController/userController');


// Get all users
adminRouter.get('/users', tokenValidate, requireAdmin, getAllUsers);
// Update user
adminRouter.put('/users/:id', tokenValidate, requireAdmin, updateUser);
// Block/unblock user
adminRouter.patch('/users/:id/block', tokenValidate, requireAdmin, blockUser);
// Delete user
adminRouter.delete('/users/:id', tokenValidate, requireAdmin, deleteUser);
// router.use(categoryRoutes);

module.exports = adminRouter; 