# TravelBuddy - Full Stack Travel Booking Web Application

Welcome to TravelBuddy! This is a MakeMyTrip clone built entirely with the MERN stack (MongoDB, Express, React, Node.js) and using standard JavaScript (.js / .jsx files as requested).

## Features
- **Authentication**: JWT-based login, registration with bcrypt, User & Admin roles.
- **Dynamic Search**: Search Flights, Hotels, Trains, and Cabs with specific criteria fields using an elegant MMT-style tabbed hero section.
- **Unified Booking Flow**: Add to cart / book specific services and see price calculations.
- **Simulated Payment Gateway**: 80% success mock payment gateway integrated into the checkout flow.
- **Dashboards**: Separate views for Users (My Bookings, stats) and Admins (Overview stats, service management placeholders, booking status overrides).

## Folder Structure

```
├── travelbuddy-backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   └── serviceController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── Booking.js
│   │   ├── Cab.js
│   │   ├── Flight.js
│   │   ├── Hotel.js
│   │   ├── Payment.js
│   │   ├── Train.js
│   │   └── User.js
│   ├── routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── serviceRoutes.js
│   ├── utils
│   │   └── generateToken.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── travelbuddy-frontend
    ├── public
    ├── src
    │   ├── components
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   └── SearchTabs.jsx
    │   ├── context
    │   │   └── AuthContext.jsx
    │   ├── pages
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── SearchResults.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js (Vite inline config)
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on `localhost:27017`

### 1. Database Setup
Make sure your MongoDB server is running. No seed data is provided; you can create a user, log in, or modify the database manually to test out things or register as an Admin. To register as an admin, just send `"role": "Admin"` in the body during Registration via Postman or edit the DB directly.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd travelbuddy-backend
   ```
2. Run database migration / setup and install dependencies (already installed during build time).
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   # OR
   node server.js
   ```
   The backend will start on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd travelbuddy-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or similar).

Enjoy building your journeys with TravelBuddy!

google auth
Frontend
npm install @react-oauth/google jwt-decode
Backend
npm install google-auth-library