const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  brand: { type: String },
  sku: { type: String },
  category: { type: String },
  subcategory: { type: String, required: false },
  images: [{ type: String ,require:false}],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
