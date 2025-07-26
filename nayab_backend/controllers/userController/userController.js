const User = require('../../models/user');
const asyncHandler = require('express-async-handler'); // For error handling

// @desc    Get user profile
// @route   GET /api/user/:id
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user details (name, email, bio, etc.)
// @route   PATCH /api/user/:id
// @access  Private
const updateUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.preferredEra = req.body.preferredEra || user.preferredEra;
    user.avatar = req.body.avatar || user.avatar;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getUserProfile, updateUserDetails };
