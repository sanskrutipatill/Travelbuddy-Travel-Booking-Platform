const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

const flights = [
  { source: 'New Delhi', destination: 'Mumbai', date: new Date(new Date().setDate(new Date().getDate() + 1)), airline: 'IndiGo', flightNumber: '6E-101', price: 4500, duration: '2h 15m', departureTime: '06:30', arrivalTime: '08:45', stops: 0 },
  { source: 'New Delhi', destination: 'Bangalore', date: new Date(new Date().setDate(new Date().getDate() + 1)), airline: 'Vistara', flightNumber: 'UK-899', price: 6800, duration: '2h 45m', departureTime: '09:30', arrivalTime: '12:15', stops: 0 },
  { source: 'Mumbai', destination: 'New Delhi', date: new Date(new Date().setDate(new Date().getDate() + 2)), airline: 'Air India', flightNumber: 'AI-554', price: 5200, duration: '2h 10m', departureTime: '08:00', arrivalTime: '10:10', stops: 0 },
  { source: 'Bangalore', destination: 'Chennai', date: new Date(new Date().setDate(new Date().getDate() + 2)), airline: 'IndiGo', flightNumber: '6E-302', price: 2100, duration: '1h 05m', departureTime: '06:45', arrivalTime: '07:50', stops: 0 },
  { source: 'Pune', destination: 'New Delhi', date: new Date(new Date().setDate(new Date().getDate() + 3)), airline: 'SpiceJet', flightNumber: 'SG-112', price: 4100, duration: '2h 00m', departureTime: '16:00', arrivalTime: '18:00', stops: 0 },
  { source: 'Kolkata', destination: 'Mumbai', date: new Date(new Date().setDate(new Date().getDate() + 3)), airline: 'Vistara', flightNumber: 'UK-720', price: 7500, duration: '2h 50m', departureTime: '18:00', arrivalTime: '20:50', stops: 0 },
  { source: 'Mumbai', destination: 'New Delhi', date: new Date('2026-04-02T10:00:00Z'), airline: 'IndiGo', flightNumber: '6E-401', price: 4200, duration: '2h 20m', departureTime: '10:00', arrivalTime: '12:20', stops: 0 },
  { source: 'Mumbai', destination: 'New Delhi', date: new Date('2026-04-02T15:30:00Z'), airline: 'Vistara', flightNumber: 'UK-918', price: 6500, duration: '2h 15m', departureTime: '15:30', arrivalTime: '17:45', stops: 0 },
  { source: 'Mumbai', destination: 'New Delhi', date: new Date('2026-04-02T19:00:00Z'), airline: 'Air India', flightNumber: 'AI-231', price: 5100, duration: '2h 10m', departureTime: '19:00', arrivalTime: '21:10', stops: 0 },
  { source: 'New Delhi', destination: 'Mumbai', date: new Date('2026-04-03T07:00:00Z'), airline: 'Air India', flightNumber: 'AI-102', price: 5500, duration: '2h 15m', departureTime: '07:00', arrivalTime: '09:15', stops: 0 },
  { source: 'New Delhi', destination: 'Mumbai', date: new Date('2026-04-03T12:00:00Z'), airline: 'SpiceJet', flightNumber: 'SG-450', price: 4800, duration: '2h 20m', departureTime: '12:00', arrivalTime: '14:20', stops: 0 },
  { source: 'New Delhi', destination: 'Mumbai', date: new Date('2026-04-03T18:00:00Z'), airline: 'IndiGo', flightNumber: '6E-231', price: 5200, duration: '2h 15m', departureTime: '18:00', arrivalTime: '20:15', stops: 0 },
  { source: 'Bangalore', destination: 'Mumbai', date: new Date('2026-04-04T08:00:00Z'), airline: 'Vistara', flightNumber: 'UK-512', price: 7200, duration: '2h 00m', departureTime: '08:00', arrivalTime: '10:00', stops: 0 },
  { source: 'Bangalore', destination: 'Mumbai', date: new Date('2026-04-04T14:00:00Z'), airline: 'Air India', flightNumber: 'AI-605', price: 6800, duration: '2h 00m', departureTime: '14:00', arrivalTime: '16:00', stops: 0 },
  { source: 'Chennai', destination: 'New Delhi', date: new Date('2026-04-05T06:00:00Z'), airline: 'IndiGo', flightNumber: '6E-105', price: 4800, duration: '2h 45m', departureTime: '06:00', arrivalTime: '08:45', stops: 0 },
  { source: 'Chennai', destination: 'New Delhi', date: new Date('2026-04-05T18:00:00Z'), airline: 'Air India', flightNumber: 'AI-560', price: 5800, duration: '2h 45m', departureTime: '18:00', arrivalTime: '20:45', stops: 0 },
  { source: 'Hyderabad', destination: 'New Delhi', date: new Date('2026-04-06T10:00:00Z'), airline: 'Vistara', flightNumber: 'UK-670', price: 6500, duration: '2h 30m', departureTime: '10:00', arrivalTime: '12:30', stops: 0 },
  { source: 'Hyderabad', destination: 'New Delhi', date: new Date('2026-04-06T19:00:00Z'), airline: 'IndiGo', flightNumber: '6E-406', price: 4800, duration: '2h 30m', departureTime: '19:00', arrivalTime: '21:30', stops: 0 },
  { source: 'Goa', destination: 'New Delhi', date: new Date('2026-04-07T06:30:00Z'), airline: 'Air India', flightNumber: 'AI-912', price: 6200, duration: '2h 45m', departureTime: '06:30', arrivalTime: '09:15', stops: 0 },
  { source: 'Goa', destination: 'New Delhi', date: new Date('2026-04-07T13:00:00Z'), airline: 'IndiGo', flightNumber: '6E-212', price: 4800, duration: '2h 45m', departureTime: '13:00', arrivalTime: '15:45', stops: 0 },
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy')
  .then(async () => {
    console.log('Connected to MongoDB');
    await Flight.deleteMany({});
    await Flight.insertMany(flights);
    console.log('Flights seeded successfully! Check the frontend to book them.');
    process.exit();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
