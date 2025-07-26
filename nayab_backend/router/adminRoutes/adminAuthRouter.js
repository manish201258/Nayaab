const express = require('express');
const adminRouter = express.Router();
const { login } = require('../../controllers/adminController/adminAuthController');

// Admin login route
adminRouter.post('/login', login);

module.exports = adminRouter; 