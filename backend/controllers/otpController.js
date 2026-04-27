const { verifyOTP, getOTPByBookingId } = require('../utils/otpStorage');
const { updateBooking, getBookingById } = require('../utils/bookingStorage');

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { bookingId, otpCode } = req.body;

    // Validation
    if (!bookingId || !otpCode) {
      return res.status(400).json({
        error: 'Please provide bookingId and otpCode'
      });
    }

    // Check if booking exists
    const booking = getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking is already confirmed
    if (booking.status !== 'pending') {
      return res.status(400).json({
        error: `Booking is already ${booking.status}. OTP verification not required.`
      });
    }

    // Verify OTP
    const isValid = verifyOTP(bookingId, otpCode);

    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid or expired OTP. Please check your code and try again.'
      });
    }

    // Update booking status to confirmed
    updateBooking(bookingId, {
      status: 'confirmed',
      otpVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Get updated booking
    const updatedBooking = getBookingById(bookingId);

    res.json({
      message: 'OTP verified successfully. Ambulance will be assigned shortly.',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error during OTP verification' });
  }
};

// Resend OTP (optional endpoint)
exports.resendOTP = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if OTP already exists and is not verified
    const existingOTP = getOTPByBookingId(bookingId);
    if (existingOTP && !existingOTP.verified) {
      return res.status(400).json({
        error: 'OTP already sent. Please check your email or wait for expiry.'
      });
    }

    // Generate new OTP
    const { generateOTP, saveOTP } = require('../utils/otpStorage');
    const { getUserById } = require('../utils/userStorage');
    
    const user = getUserById(booking.userId);
    const otpCode = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    const otpData = {
      bookingId: bookingId,
      code: otpCode,
      email: user.email,
      expiresAt: otpExpiry.toISOString(),
      verified: false,
      createdAt: new Date().toISOString()
    };

    saveOTP(otpData);

    // In production, send email/SMS here
    console.log(`Resent OTP for booking ${bookingId}: ${otpCode} (sent to ${user.email})`);

    res.json({
      message: 'OTP resent successfully. Please check your email.',
      otp: otpCode // Remove in production
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
