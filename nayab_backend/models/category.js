const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String }]
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema); 