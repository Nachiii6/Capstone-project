const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Read users from file
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Write users to file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

// Get all users
const getAllUsers = () => {
  return readUsers();
};

// Get user by email
const getUserByEmail = (email) => {
  const users = readUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Get user by ID
const getUserById = (id) => {
  const users = readUsers();
  return users.find(user => user.id === id);
};

// Save new user
const saveUser = (userData) => {
  const users = readUsers();
  users.push(userData);
  writeUsers(users);
  return userData;
};

// Update user
const updateUser = (userId, updates) => {
  const users = readUsers();
  const index = users.findIndex(user => user.id === userId);
  
  if (index === -1) {
    return null;
  }
  
  users[index] = { ...users[index], ...updates };
  writeUsers(users);
  return users[index];
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  saveUser,
  updateUser
};

