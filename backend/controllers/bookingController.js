const { saveBooking, getBookingById, getBookingsByUserId } = require('../utils/bookingStorage');
const { generateOTP, saveOTP } = require('../utils/otpStorage');
const { getUserById } = require('../utils/userStorage');

// Pricing configuration
const PRICING = {
  Critical: { baseFare: 250, responseTime: 3 },
  High: { baseFare: 200, responseTime: 5 },
  Medium: { baseFare: 150, responseTime: 10 },
  Low: { baseFare: 100, responseTime: 15 }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    // Get userId from authenticated user (support both id and _id)
    const userId = req.userId || req.user?.id || req.user?._id;
    
    const {
      emergencyLevel,
      pickupAddress,
      dropAddress,
      patientName,
      patientAge,
      contactNumber,
      condition,
      insurance,
      specialReq
    } = req.body;

    // Validation
    if (!userId) {
      return res.status(401).json({
        error: 'User authentication required'
      });
    }

    if (!emergencyLevel || !pickupAddress || !dropAddress || 
        !patientName || !patientAge || !contactNumber) {
      return res.status(400).json({
        error: 'Please provide all required fields: emergencyLevel, pickupAddress, dropAddress, patientName, patientAge, contactNumber'
      });
    }

    // Validate emergency level
    if (!PRICING[emergencyLevel]) {
      return res.status(400).json({
        error: 'Invalid emergency level. Must be one of: Critical, High, Medium, Low'
      });
    }

    // Verify user exists
    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate pricing
    const pricing = PRICING[emergencyLevel];

    // Create booking object
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const booking = {
      _id: bookingId,
      userId,
      emergencyLevel,
      pickupAddress,
      dropAddress,
      patientName,
      patientAge: parseInt(patientAge),
      contactNumber,
      condition: condition || '',
      insurance: insurance || '',
      specialReq: specialReq || '',
      status: 'pending', // pending, confirmed, assigned, in-transit, completed, cancelled
      baseFare: pricing.baseFare,
      estimatedResponseTime: pricing.responseTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save booking
    saveBooking(booking);

    // Generate and save OTP
    const otpCode = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

    const otpData = {
      bookingId: bookingId,
      code: otpCode,
      email: user.email,
      expiresAt: otpExpiry.toISOString(),
      verified: false,
      createdAt: new Date().toISOString()
    };

    saveOTP(otpData);

    // In a real application, you would send OTP via email/SMS here
    // For now, we'll return it in the response (in production, remove this)
    console.log(`OTP for booking ${bookingId}: ${otpCode} (sent to ${user.email})`);

    res.status(201).json({
      message: 'Booking created successfully. OTP sent to your email.',
      booking,
      otp: otpCode // Remove this in production - only for development
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error during booking creation' });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    // Get userId from authenticated user or params
    const userId = req.params.userId || req.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify user can only access their own bookings
    const authenticatedUserId = req.userId;
    if (authenticatedUserId !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only view your own bookings.' });
    }

    const bookings = getBookingsByUserId(userId);
    
    res.json({
      message: 'Bookings retrieved successfully',
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get booking status
exports.getBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking status retrieved successfully',
      booking
    });
  } catch (error) {
    console.error('Get booking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
