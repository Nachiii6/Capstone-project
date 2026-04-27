const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const otpRoutes = require('./routes/otp');
const serviceRoutes = require('./routes/services');
const ambulanceRoutes = require('./routes/ambulances');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/ambulances', ambulanceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
  console.log('\nAvailable endpoints:');
  console.log('  - POST /api/auth/register - User registration');
  console.log('  - POST /api/auth/login - User login');
  console.log('  - POST /api/booking/create - Create booking (auth required)');
  console.log('  - GET  /api/booking/user/:userId - Get user bookings (auth required)');
  console.log('  - GET  /api/booking/:bookingId - Get booking status (auth required)');
  console.log('  - POST /api/otp/verify - Verify OTP (auth required)');
  console.log('  - POST /api/otp/resend - Resend OTP (auth required)');
  console.log('  - GET  /api/services - Get all services');
  console.log('  - GET  /api/services/:level - Get service by level');
  console.log('  - GET  /api/ambulances/location/by-booking/:bookingId - Get ambulance location (auth required)');
});

