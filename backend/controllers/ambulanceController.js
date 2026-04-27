const { getBookingById } = require('../utils/bookingStorage');

// Mock ambulance location data
// In a real application, this would come from GPS tracking or a database
const mockAmbulanceLocations = {};

// Get ambulance location by booking ID
exports.getLocationByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Check if booking exists
    const booking = getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking is confirmed or in transit
    if (booking.status === 'pending') {
      return res.status(400).json({
        error: 'Ambulance not yet assigned. Please verify OTP first.'
      });
    }

    // Generate or retrieve mock location
    // In production, this would fetch real-time GPS data
    let location = mockAmbulanceLocations[bookingId];
    
    if (!location) {
      // Generate mock location based on pickup address
      // In real app, this would be actual GPS coordinates from ambulance
      location = {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // Mock NYC area coordinates
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        heading: Math.random() * 360,
        speed: 30 + Math.random() * 40, // km/h
        lastUpdate: new Date().toISOString()
      };
      mockAmbulanceLocations[bookingId] = location;
    } else {
      // Update location slightly to simulate movement
      location.latitude += (Math.random() - 0.5) * 0.001;
      location.longitude += (Math.random() - 0.5) * 0.001;
      location.heading = Math.random() * 360;
      location.speed = 30 + Math.random() * 40;
      location.lastUpdate = new Date().toISOString();
    }

    // Calculate estimated time of arrival (mock calculation)
    // In production, this would use actual routing algorithms
    const estimatedETA = booking.status === 'assigned' || booking.status === 'in-transit' 
      ? Math.floor(5 + Math.random() * 10) // 5-15 minutes
      : null;

    res.json({
      message: 'Ambulance location retrieved successfully',
      bookingId,
      location,
      status: booking.status,
      estimatedETA: estimatedETA ? `${estimatedETA} minutes` : null,
      pickupAddress: booking.pickupAddress,
      dropAddress: booking.dropAddress
    });
  } catch (error) {
    console.error('Get ambulance location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update ambulance location (for driver/admin use - would require driver authentication)
exports.updateLocation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude, heading, speed } = req.body;

    if (!bookingId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Booking ID, latitude, and longitude are required'
      });
    }

    const booking = getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      heading: heading ? parseFloat(heading) : null,
      speed: speed ? parseFloat(speed) : null,
      lastUpdate: new Date().toISOString()
    };

    mockAmbulanceLocations[bookingId] = location;

    res.json({
      message: 'Ambulance location updated successfully',
      location
    });
  } catch (error) {
    console.error('Update ambulance location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
