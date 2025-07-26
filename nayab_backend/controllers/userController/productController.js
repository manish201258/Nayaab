const Product = require('../../models/producs');

// Get all products for users (no status filter for testing)
async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
  }
}

// Get a single product by ID (no status filter for testing)
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product.', error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById
};
