const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const blogRoutes = require('./blogRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
const adminAuthRouter = require('./adminAuthRouter');

router.use(userRoutes);
router.use(blogRoutes);
router.use(categoryRoutes);
router.use(orderRoutes);
router.use(productRoutes);
router.use(adminAuthRouter);

module.exports = router; 