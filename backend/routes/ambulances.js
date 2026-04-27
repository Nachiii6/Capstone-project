const express = require('express');
const router = express.Router();
const ambulanceController = require('../controllers/ambulanceController');
const { authenticate } = require('../middleware/auth');

// Get ambulance location by booking ID (requires authentication)
router.get('/location/by-booking/:bookingId', authenticate, ambulanceController.getLocationByBooking);

// Update ambulance location (requires authentication - typically for drivers)
router.put('/location/:bookingId', authenticate, ambulanceController.updateLocation);

module.exports = router;
