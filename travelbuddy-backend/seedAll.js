const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('./models/Hotel');
const Train = require('./models/Train');
const Cab = require('./models/Cab');

dotenv.config();

const hotels = [
  { name: 'Taj Mahal Palace', location: 'Mumbai', price: 15000, rating: 5, amenities: ['Pool', 'Spa', 'Wifi', 'Breakfast'], image: 'https://source.unsplash.com/400x300/?hotel,mumbai', imageUrl: 'https://source.unsplash.com/400x300/?hotel,mumbai' },
  { name: 'ITC Maurya', location: 'New Delhi', price: 12000, rating: 5, amenities: ['Gym', 'Wifi', 'Breakfast'], image: 'https://source.unsplash.com/400x300/?hotel,new-delhi', imageUrl: 'https://source.unsplash.com/400x300/?hotel,new-delhi' },
  { name: 'The Leela Palace', location: 'Bangalore', price: 14000, rating: 4.9, amenities: ['Pool', 'Spa', 'Wifi'], image: 'https://source.unsplash.com/400x300/?hotel,bangalore', imageUrl: 'https://source.unsplash.com/400x300/?hotel,bangalore' },
  { name: 'Novotel Juhu', location: 'Mumbai', price: 8000, rating: 4.5, amenities: ['Pool', 'Wifi', 'Bar'], image: 'https://source.unsplash.com/400x300/?hotel,mumbai', imageUrl: 'https://source.unsplash.com/400x300/?hotel,mumbai' },
  { name: 'ibis Aerocity', location: 'New Delhi', price: 3500, rating: 4.0, amenities: ['Wifi', 'Breakfast'], image: 'https://source.unsplash.com/400x300/?hotel,new-delhi', imageUrl: 'https://source.unsplash.com/400x300/?hotel,new-delhi' },
  { name: 'Red Fox', location: 'Hyderabad', price: 2500, rating: 3.8, amenities: ['Wifi'], image: 'https://source.unsplash.com/400x300/?hotel,hyderabad', imageUrl: 'https://source.unsplash.com/400x300/?hotel,hyderabad' }
];

const trains = [
  { name: 'Rajdhani Express', trainNumber: '12951', source: 'Mumbai', destination: 'New Delhi', date: new Date(new Date().setDate(new Date().getDate() + 1)), class: '1AC', timing: '05:00 PM - 08:30 AM', price: 4500 },
  { name: 'Duronto Express', trainNumber: '12239', source: 'Mumbai', destination: 'New Delhi', date: new Date(new Date().setDate(new Date().getDate() + 1)), class: '2AC', timing: '11:15 PM - 04:30 PM', price: 3200 },
  { name: 'Shatabdi Express', trainNumber: '12002', source: 'New Delhi', destination: 'Bangalore', date: new Date(new Date().setDate(new Date().getDate() + 2)), class: '3AC', timing: '06:00 AM - 11:00 PM', price: 2500 },
  { name: 'Garib Rath', trainNumber: '12215', source: 'New Delhi', destination: 'Mumbai', date: new Date(new Date().setDate(new Date().getDate() + 3)), class: '3AC', timing: '10:00 AM - 08:00 AM', price: 1100 },
  { name: 'Vande Bharat', trainNumber: '22436', source: 'New Delhi', destination: 'Chennai', date: new Date(new Date().setDate(new Date().getDate() + 2)), class: '1AC', timing: '06:00 AM - 02:00 PM', price: 2800 }
];

const cabs = [
  { pickup: 'New Delhi Airport', drop: 'Connaught Place', cabType: 'Sedan', distance: 15, price: 800, driverName: 'Rahul Kumar', carModel: 'Honda City' },
  { pickup: 'Mumbai Airport', drop: 'Bandra', cabType: 'Mini', distance: 8, price: 450, driverName: 'Amit Shah', carModel: 'Swift Dzire' },
  { pickup: 'Bangalore Airport', drop: 'Koramangala', cabType: 'SUV', distance: 40, price: 1500, driverName: 'Shivraj', carModel: 'Innova Crysta' },
  { pickup: 'Pune Station', drop: 'Viman Nagar', cabType: 'Mini', distance: 6, price: 250, driverName: 'Prakash', carModel: 'WagonR' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await Hotel.deleteMany({});
    await Train.deleteMany({});
    await Cab.deleteMany({});
    
    await Hotel.insertMany(hotels);
    await Train.insertMany(trains);
    await Cab.insertMany(cabs);
    
    console.log('Seeded successfully! Hotels, Trains, and Cabs added.');
    process.exit();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
