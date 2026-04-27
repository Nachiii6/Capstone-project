const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

// Create booking (requires authentication)
router.post('/create', authenticate, bookingController.createBooking);

// Get user bookings (requires authentication)
router.get('/user/:userId', authenticate, bookingController.getUserBookings);

// Get booking status (requires authentication)
router.get('/:bookingId', authenticate, bookingController.getBookingStatus);

module.exports = router;
