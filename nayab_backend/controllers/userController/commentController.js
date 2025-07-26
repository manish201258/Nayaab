const Comment = require('../../models/comment');
const User = require('../../models/user');
const asyncHandler = require('express-async-handler');

// @desc    Get comments for a product
// @route   GET /api/user/products/:productId/comments
// @access  Public
const getProductComments = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log('Fetching comments for product:', productId);
    
    const comments = await Comment.find({ productId })
      .sort({ createdAt: -1 })
      .select('userName text createdAt')
      .limit(50);

    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

// @desc    Add a comment to a product
// @route   POST /api/user/products/:productId/comments
// @access  Private
const addProductComment = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    // Fetch user data to get the name
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    console.log('Adding comment:', { productId, text, userId, userName: user.name });

    if (!text || text.trim().length === 0) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    if (text.length > 500) {
      res.status(400);
      throw new Error('Comment text must be less than 500 characters');
    }

    // Check if user already commented on this product
    const existingComment = await Comment.findOne({ 
      productId, 
      userId 
    });

    if (existingComment) {
      res.status(400);
      throw new Error('You have already commented on this product');
    }

    const comment = await Comment.create({
      productId,
      userId,
      userName: user.name,
      text: text.trim()
    });

    const savedComment = await Comment.findById(comment._id)
      .select('userName text createdAt');

    res.status(201).json({ 
      message: 'Comment added successfully',
      comment: savedComment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

// @desc    Update user's comment
// @route   PUT /api/user/products/:productId/comments/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      res.status(403);
      throw new Error('Not authorized to update this comment');
    }

    if (text && text.trim().length === 0) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    if (text && text.length > 500) {
      res.status(400);
      throw new Error('Comment text must be less than 500 characters');
    }

    comment.text = text ? text.trim() : comment.text;
    
    const updatedComment = await comment.save();
    
    const savedComment = await Comment.findById(updatedComment._id)
      .select('userName text createdAt');

    res.json({ 
      message: 'Comment updated successfully',
      comment: savedComment 
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

// @desc    Delete user's comment
// @route   DELETE /api/user/products/:productId/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

module.exports = {
  getProductComments,
  addProductComment,
  updateComment,
  deleteComment
}; 