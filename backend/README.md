# Ambulance Booking Backend API

Backend server for the Ambulance Booking System.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (already created) and update JWT_SECRET if needed:
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
  - Body: `{ name, email, phone, password, role, ... }`
  
- `POST /api/auth/login` - User login
  - Body: `{ email, password, role }`

### Health Check

- `GET /api/health` - Server health check

## Data Storage

User data is stored in `data/users.json` file. The data persists between server restarts.

