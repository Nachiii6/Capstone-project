const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { saveUser, getUserByEmail, getAllUsers } = require('../utils/userStorage');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, role, driverLicense, vehicleRegistration, emergencyContactName, emergencyContactPhone } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ 
        error: 'Please provide all required fields: name, email, phone, password, role' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password: hashedPassword,
      role: role.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    // Add driver-specific fields if role is driver
    if (role.toLowerCase() === 'driver') {
      if (!driverLicense || !vehicleRegistration || !emergencyContactName || !emergencyContactPhone) {
        return res.status(400).json({ 
          error: 'Driver registration requires: driverLicense, vehicleRegistration, emergencyContactName, emergencyContactPhone' 
        });
      }
      userData.driverLicense = driverLicense;
      userData.vehicleRegistration = vehicleRegistration;
      userData.emergencyContactName = emergencyContactName;
      userData.emergencyContactPhone = emergencyContactPhone;
      userData.status = 'pending'; // Driver accounts need approval
    } else {
      userData.status = 'active';
    }

    // Save user
    saveUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email, role: userData.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;
    
    // Add _id for frontend compatibility
    const userResponse = { ...userWithoutPassword, _id: userData.id };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if role matches (if role is provided)
    if (role && user.role !== role.toLowerCase()) {
      return res.status(401).json({ 
        error: `Invalid credentials for ${role} login` 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if user is active (for drivers, check if approved)
    if (user.status !== 'active') {
      return res.status(403).json({ 
        error: 'Your account is pending approval. Please contact administrator.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Add _id for frontend compatibility
    const userResponse = { ...userWithoutPassword, _id: user.id };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
};

