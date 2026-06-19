https://github.com/user-attachments/assets/f71c832b-e79a-4b5b-ae19-7df639f7072e

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


<img width="1919" height="1079" alt="Screenshot 2026-06-19 181427" src="https://github.com/user-attachments/assets/8e97319b-f68d-4631-9a82-5315d95bf3bc" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181455" src="https://github.com/user-attachments/assets/e5f68a8c-3c1f-4d8e-a37f-d461252ee47c" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181510" src="https://github.com/user-attachments/assets/19de8805-c3da-470d-8bb5-b3efe160179a" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181525" src="https://github.com/user-attachments/assets/e1c2566c-fb4b-43a3-add9-36a3da84b743" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181536" src="https://github.com/user-attachments/assets/000ad43a-df12-4fc5-86e5-118f95a3f45c" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181549" src="https://github.com/user-attachments/assets/cbe6e47b-7e58-4e93-8bab-33045678e652" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181559" src="https://github.com/user-attachments/assets/e9bf1070-f905-40dc-8456-9c7fe35d6730" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181609" src="https://github.com/user-attachments/assets/0cd5ee91-1627-4569-b4a8-be1f997bb64e" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181619" src="https://github.com/user-attachments/assets/eab3df36-ca06-4061-84c3-a015d807b606" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181628" src="https://github.com/user-attachments/assets/0a0ce9cd-2583-482e-8ffe-fd007c3c7706" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181638" src="https://github.com/user-attachments/assets/d156b29f-8f50-48a8-9db4-ae85728d6eb1" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181649" src="https://github.com/user-attachments/assets/f4481918-cdc7-40ef-a0a4-4801b5e8dc65" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181700" src="https://github.com/user-attachments/assets/939aff26-fe1a-483f-90a8-5949942740f6" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181709" src="https://github.com/user-attachments/assets/d8c1ea6f-b55e-4db1-aef9-60a320f502c5" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181719" src="https://github.com/user-attachments/assets/ef970f87-5f31-4220-be71-6dc3b19b37fe" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181757" src="https://github.com/user-attachments/assets/68208e96-c172-42f3-8174-1dbc97e7fb16" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181822" src="https://github.com/user-attachments/assets/eaa37944-072c-41ec-9e31-1dcd5bbdbbf1" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181830" src="https://github.com/user-attachments/assets/6bdfb311-a34c-4509-ac2d-bb3e36e065ec" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181841" src="https://github.com/user-attachments/assets/8bcd7f7f-b227-42e3-a9ab-acaf170d71d4" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181853" src="https://github.com/user-attachments/assets/9d79f3d2-9310-4f45-a4ef-5cc1229b01d6" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181902" src="https://github.com/user-attachments/assets/ecd8560d-a0e7-4707-9609-0036341d679c" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181913" src="https://github.com/user-attachments/assets/c6b82ecf-f3c8-4925-b697-13b17e287dfe" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181930" src="https://github.com/user-attachments/assets/ea2278dd-773d-408f-8d20-530f5f3eb0c6" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 181955" src="https://github.com/user-attachments/assets/509a482c-323b-452d-8041-361f9fe1ea37" />
<img width="1919" height="1079" alt="Screenshot 2026-06-19 182005" src="https://github.com/user-attachments/assets/fc5f07c2-8760-442c-b013-34f180b8e6fc" />






