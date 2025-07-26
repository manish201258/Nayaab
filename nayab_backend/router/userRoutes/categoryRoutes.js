const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../../controllers/userController/categoryController');

router.get('/', getAllCategories);

module.exports = router; 