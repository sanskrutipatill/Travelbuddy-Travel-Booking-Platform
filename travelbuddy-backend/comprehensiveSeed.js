const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

// Generate dates relative to today - spread flights over next 90 days
const getRandomDate = () => {
  const date = new Date();
  const daysAhead = Math.floor(Math.random() * 90); // 0-89 days ahead
  date.setDate(date.getDate() + daysAhead);
  return date;
};

// Generate time string
const generateTime = () => {
  const hour = Math.floor(Math.random() * 18) + 5; // 5am to 11pm
  const minute = Math.random() > 0.5 ? '00' : '30';
  return `${hour}:${minute}`;
};

// Calculate arrival time
const calculateArrival = (departure, durationHours) => {
  const [h, m] = departure.split(':').map(Number);
  const totalMinutes = h * 60 + m + durationHours * 60;
  const arrivalHour = Math.floor(totalMinutes / 60) % 24;
  const arrivalMinute = totalMinutes % 60;
  return `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
};

// Helper to create flight with all required fields
const createFlight = (data) => ({
  source: data.source,
  destination: data.destination,
  date: data.date,
  airline: data.airline,
  flightNumber: data.flightNumber,
  price: data.price,
  duration: data.duration,
  departureTime: data.departureTime,
  arrivalTime: data.arrivalTime,
  stops: data.stops || 0
});

// Define route configurations
const routes = [
  { source: 'New Delhi', destination: 'Mumbai', duration: '2h 15m' },
  { source: 'Mumbai', destination: 'New Delhi', duration: '2h 10m' },
  { source: 'New Delhi', destination: 'Bangalore', duration: '2h 45m' },
  { source: 'Bangalore', destination: 'New Delhi', duration: '2h 45m' },
  { source: 'Mumbai', destination: 'Pune', duration: '0h 50m' },
  { source: 'Pune', destination: 'Mumbai', duration: '0h 55m' },
  { source: 'Chennai', destination: 'New Delhi', duration: '2h 45m' },
  { source: 'New Delhi', destination: 'Chennai', duration: '2h 50m' },
  { source: 'Hyderabad', destination: 'New Delhi', duration: '2h 30m' },
  { source: 'New Delhi', destination: 'Hyderabad', duration: '2h 25m' },
  { source: 'Kolkata', destination: 'New Delhi', duration: '2h 30m' },
  { source: 'New Delhi', destination: 'Kolkata', duration: '2h 20m' },
  { source: 'Bangalore', destination: 'Mumbai', duration: '2h 00m' },
  { source: 'New Delhi', destination: 'Goa', duration: '2h 45m' },
  { source: 'Goa', destination: 'New Delhi', duration: '2h 50m' },
];

const airlines = ['Air India', 'IndiGo', 'Vistara', 'SpiceJet', 'Go First', 'AirAsia'];

// Generate 500+ flights spread across all routes and dates
const flights = [];

routes.forEach((route, routeIndex) => {
  // Generate 30-40 flights per route over the next 90 days
  const flightsPerRoute = 35;

  for (let i = 0; i < flightsPerRoute; i++) {
    const airline = airlines[routeIndex % airlines.length];
    const airlineCode = airline === 'Air India' ? 'AI' :
                       airline === 'IndiGo' ? '6E' :
                       airline === 'Vistara' ? 'UK' :
                       airline === 'SpiceJet' ? 'SG' :
                       airline === 'Go First' ? 'G8' : 'I5';
    const date = getRandomDate();
    const departureTime = generateTime();
    const durationHours = parseFloat(route.duration) || 2;
    const arrivalTime = calculateArrival(departureTime, durationHours);
    const price = Math.floor(2000 + Math.random() * 6000);
    const stops = Math.random() > 0.85 ? 1 : 0; // 15% chance of 1 stop

    flights.push(createFlight({
      source: route.source,
      destination: route.destination,
      date,
      airline,
      flightNumber: `${airlineCode}-${1000 + routeIndex * 100 + i}`,
      price,
      duration: route.duration,
      departureTime,
      arrivalTime,
      stops
    }));
  }
});

console.log(`Total flights to seed: ${flights.length}`);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy')
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    await Flight.deleteMany({});
    console.log('🗑️  Cleared existing flights');

    await Flight.insertMany(flights);
    console.log(`✅ Successfully seeded ${flights.length} flights!`);

    // Show counts by route for verification
    const counts = await Flight.aggregate([
      {
        $group: {
          _id: { source: '$source', destination: '$destination' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    console.log('📊 Flights by route:');
    counts.forEach(c => {
      console.log(`   ${c._id.source} → ${c._id.destination}: ${c.count} flights`);
    });

    // Show sample query test
    console.log('\n🔍 Testing sample queries:');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const testQueries = [
      { source: 'New Delhi', destination: 'Mumbai' },
      { source: 'delhi', destination: 'mumbai' }, // lowercase test
      { source: 'Mumbai', destination: 'Delhi' },
      { source: 'Bangalore', destination: 'Mumbai' },
    ];

    for (const q of testQueries) {
      const result = await Flight.find({
        source: { $regex: q.source, $options: 'i' },
        destination: { $regex: q.destination, $options: 'i' }
      }).limit(3);
      console.log(`   ${q.source} → ${q.destination}: ${result.length} flights found`);
    };

    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });


console.log(`Total flights to seed: ${flights.length}`);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy')
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    await Flight.deleteMany({});
    console.log('🗑️  Cleared existing flights');

    await Flight.insertMany(flights);
    console.log(`✅ Successfully seeded ${flights.length} flights!`);

    // Show counts by route for verification
    const counts = await Flight.aggregate([
      {
        $group: {
          _id: { source: '$source', destination: '$destination' },
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('📊 Flights by route:');
    counts.forEach(c => {
      console.log(`   ${c._id.source} → ${c._id.destination}: ${c.count} flights`);
    });

    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
