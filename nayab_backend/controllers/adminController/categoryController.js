const Category = require('../../models/category');

// Get all categories
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
}

// Create a new category
async function createCategory(req, res) {
  try {
    const { name, subcategories } = req.body;
    const category = await Category.create({ name, subcategories });
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
}

// Update a category
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, subcategories } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name, subcategories }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
}

// Delete a category
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
}

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory }; 