const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route
router.post('/register', authController.signup);

// Login route
router.post('/login', authController.login);

module.exports = router;

