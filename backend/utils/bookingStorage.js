const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize bookings file if it doesn't exist
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
}

// Read bookings from file
const readBookings = () => {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bookings file:', error);
    return [];
  }
};

// Write bookings to file
const writeBookings = (bookings) => {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing bookings file:', error);
    return false;
  }
};

// Get all bookings
const getAllBookings = () => {
  return readBookings();
};

// Get booking by ID
const getBookingById = (id) => {
  const bookings = readBookings();
  return bookings.find(booking => booking._id === id);
};

// Get bookings by user ID
const getBookingsByUserId = (userId) => {
  const bookings = readBookings();
  return bookings.filter(booking => booking.userId === userId);
};

// Save new booking
const saveBooking = (bookingData) => {
  const bookings = readBookings();
  bookings.push(bookingData);
  writeBookings(bookings);
  return bookingData;
};

// Update booking
const updateBooking = (bookingId, updates) => {
  const bookings = readBookings();
  const index = bookings.findIndex(booking => booking._id === bookingId);
  
  if (index === -1) {
    return null;
  }
  
  bookings[index] = { ...bookings[index], ...updates };
  writeBookings(bookings);
  return bookings[index];
};

module.exports = {
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  saveBooking,
  updateBooking
};
