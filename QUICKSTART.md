# Quick Start Guide

## Prerequisites
- Node.js installed (v14 or higher)
- npm installed

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../user_frontend
npm install
```

### 3. Start Backend Server
```bash
# In backend directory
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

### 4. Start Frontend Server (New Terminal)
```bash
# In user_frontend directory
cd user_frontend
npm start
```
Frontend runs on: `http://localhost:3000`

## Testing the Application

### Test Registration
1. Open browser to `http://localhost:3000`
2. Navigate to `/auth/signup` or click "Sign up"
3. Fill out the registration form
4. Submit - user will be created and logged in automatically
5. Check `backend/data/users.json` to see stored user data
6. Check browser localStorage (DevTools → Application → Local Storage) to see token

### Test Login
1. Navigate to `/auth/login` or click "Sign in"
2. Enter email and password
3. Submit - you'll be logged in
4. Token and user data stored in localStorage

## File Structure Summary

```
backend/
├── server.js              # Main server file
├── routes/auth.js         # Authentication routes
├── controllers/           # Request handlers
│   └── authController.js  # Login/Signup logic
├── utils/
│   └── userStorage.js     # User data storage (JSON file)
└── data/
    └── users.json         # User data (created automatically)

user_frontend/
├── src/
│   ├── services/api.js    # Axios API configuration
│   ├── context/
│   │   └── AuthContext.js # Authentication state
│   └── pages/
│       ├── Login.js       # Login page
│       └── UserSignup.js  # Signup page
```

## How It Works

1. **Frontend** uses axios to make HTTP requests to backend
2. **Backend** handles authentication and stores data in `users.json`
3. **JWT tokens** are generated and sent to frontend
4. **Frontend** stores token and user data in localStorage
5. **Axios interceptor** automatically adds token to all API requests

## Common Issues

- **Port 5000 already in use**: Change PORT in `backend/.env`
- **CORS errors**: Make sure backend is running
- **Cannot connect**: Verify both servers are running
- **Token not saving**: Check browser console for errors

