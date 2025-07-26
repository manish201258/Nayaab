const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const blogRoutes = require('./blogRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const productRoutes = require('./productRoutes');
const authRouter = require('./authRouter');
const commentRoutes = require('./commentRoutes');

router.use(userRouter);
router.use(blogRoutes);
router.use(categoryRoutes);
router.use(orderRoutes);
router.use(productRoutes);
router.use(authRouter);
router.use(commentRoutes);

module.exports = router; 