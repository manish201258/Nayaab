const express = require('express');
const userRouter = express.Router();
const tokenValidate = require('../../middleware/tokenValidate');
const {
  getProductComments,
  addProductComment,
  updateComment,
  deleteComment
} = require('../../controllers/userController/commentController');

// Get comments for a product (public)
userRouter.get('/products/:productId/comments', getProductComments);

// Add comment to a product (private)
userRouter.post('/products/:productId/comments', tokenValidate, addProductComment);

// Update user's comment (private)
userRouter.put('/products/:productId/comments/:commentId', tokenValidate, updateComment);

// Delete user's comment (private)
userRouter.delete('/products/:productId/comments/:commentId', tokenValidate, deleteComment);

module.exports = userRouter; 