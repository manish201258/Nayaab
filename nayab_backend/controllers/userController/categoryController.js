const Category = require('../../models/category');

// Get all categories and subcategories for users
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
}

module.exports = { getAllCategories }; 