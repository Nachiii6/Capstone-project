const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const { authenticate } = require('../middleware/auth');

// Verify OTP (requires authentication)
router.post('/verify', authenticate, otpController.verifyOTP);

// Resend OTP (requires authentication)
router.post('/resend', authenticate, otpController.resendOTP);

module.exports = router;
