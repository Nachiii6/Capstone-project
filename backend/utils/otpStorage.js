const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const OTP_FILE = path.join(DATA_DIR, 'otps.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize OTP file if it doesn't exist
if (!fs.existsSync(OTP_FILE)) {
  fs.writeFileSync(OTP_FILE, JSON.stringify([], null, 2));
}

// Read OTPs from file
const readOTPs = () => {
  try {
    const data = fs.readFileSync(OTP_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading OTP file:', error);
    return [];
  }
};

// Write OTPs to file
const writeOTPs = (otps) => {
  try {
    fs.writeFileSync(OTP_FILE, JSON.stringify(otps, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing OTP file:', error);
    return false;
  }
};

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP
const saveOTP = (otpData) => {
  const otps = readOTPs();
  otps.push(otpData);
  writeOTPs(otps);
  return otpData;
};

// Get OTP by booking ID
const getOTPByBookingId = (bookingId) => {
  const otps = readOTPs();
  return otps.find(otp => otp.bookingId === bookingId && !otp.verified);
};

// Verify and mark OTP as used
const verifyOTP = (bookingId, otpCode) => {
  const otps = readOTPs();
  const otpIndex = otps.findIndex(
    otp => otp.bookingId === bookingId && 
           otp.code === otpCode && 
           !otp.verified &&
           new Date(otp.expiresAt) > new Date()
  );
  
  if (otpIndex === -1) {
    return false;
  }
  
  otps[otpIndex].verified = true;
  otps[otpIndex].verifiedAt = new Date().toISOString();
  writeOTPs(otps);
  return true;
};

// Clean expired OTPs (optional utility)
const cleanExpiredOTPs = () => {
  const otps = readOTPs();
  const now = new Date();
  const validOTPs = otps.filter(otp => new Date(otp.expiresAt) > now);
  writeOTPs(validOTPs);
};

module.exports = {
  generateOTP,
  saveOTP,
  getOTPByBookingId,
  verifyOTP,
  cleanExpiredOTPs
};
