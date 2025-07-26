const User = require('../../models/user');

// Get all users (with optional filters)
async function getAllUsers(req, res) {
  try {
    const { search = '', status, role } = req.query;
    let query = { isDeleted: { $ne: true } };
    if (status === 'active') query.isBlocked = false;
    if (status === 'inactive') query.isBlocked = true;
    if (role) query.isAdmin = role === 'admin';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
}

// Update user (name, email, role, phone, address, preferredEra)
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address, preferredEra } = req.body;
    const update = { name, email };
    if (role !== undefined) update.isAdmin = role === 'admin';
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;
    if (preferredEra !== undefined) update.preferredEra = preferredEra;
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user.', error: error.message });
  }
}

// Block/unblock user
async function blockUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    return res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`, user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to block/unblock user.', error: error.message });
  }
}

// Delete user (soft delete)
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ message: `User with ID ${id} has been deleted.` });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user.', error: error.message });
  }
}

// Update last login (to be called on successful login)
async function updateLastLogin(userId) {
  try {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  } catch (error) {
    // Ignore errors for last login update
  }
}

module.exports = { getAllUsers, updateUser, blockUser, deleteUser, updateLastLogin }; 