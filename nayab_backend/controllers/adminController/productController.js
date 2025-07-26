const Product = require('../../models/producs');

// Get all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
  }
}

// Get a single product by ID
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

// Create a new product
async function createProduct(req, res) {
  try {
    const { name, description, price, stock, brand, sku, category, featured, status } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      brand,
      sku,
      category,
      images,
      featured,
      status
    });
    return res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    return res.status(500).json({ message: 'Product creation failed.', error: error.message });
  }
}

// Update an existing product
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    let updateData = req.body;
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ message: 'Product updated successfully.', product });
  } catch (error) {
    return res.status(500).json({ message: 'Product update failed.', error: error.message });
  }
}

// Delete a product
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Product deletion failed.', error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
