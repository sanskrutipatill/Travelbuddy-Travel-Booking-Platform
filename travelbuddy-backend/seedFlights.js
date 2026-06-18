/**
 * ============================================
 * TRAVELBUDDY - FLIGHT DATA SEEDER
 * ============================================
 *
 * 🎯 PURPOSE:
 * Generate 200+ realistic flights for the MERN travel booking app
 *
 * 📊 DATASET SIZE:
 * - 80+ domestic routes (3-8 flights each)
 * - 200+ international routes (5-12 flights each)
 * - Total: ~700-900 flights typically
 *
 * 🏙️  CITIES COVERED:
 * Indian: Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata,
 *         Ahmedabad, Jaipur, Goa, Kochi, Bhubaneswar, Lucknow,
 *         Chandigarh, Indore, Visakhapatnam, Coimbatore, Trivandrum
 *
 * Global:  Dubai, Singapore, London, New York, Paris, Sydney,
 *         Toronto, Bangkok, Kuala Lumpur, Tokyo, Frankfurt, Hong Kong
 *
 * ✈️  AIRLINES:
 * Indigo, Air India, SpiceJet, Vistara, Go First, Akasa Air, AirAsia,
 * Emirates, Qatar Airways, Singapore Airlines, British Airways, Lufthansa,
 * Air France, Delta, United Airlines
 *
 * 🚀 USAGE:
 *   node seedFlights.js
 *
 * ⚠️  WARNING:
 *   This will DELETE all existing flights and insert new ones.
 *
 * ✅ COMPATIBILITY:
 *   Works with existing Flight model and search/filter/sort logic
 *   No changes required to frontend or API endpoints
 */

// ============================================
// IMPORTS
// ============================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

// ============================================
// FLIGHT DATA SEEDER - 200+ REALISTIC FLIGHTS
// ============================================

const airlines = [
  'Indigo',
  'Air India',
  'SpiceJet',
  'Vistara',
  'Go First',
  'Akasa Air',
  'AirAsia',
  'Emirates',
  'Qatar Airways',
  'Singapore Airlines',
  'British Airways',
  'Lufthansa',
  'Air France',
  'Delta',
  'United Airlines'
];

const indianCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Goa',
  'Kochi',
  'Bhubaneswar',
  'Lucknow',
  'Chandigarh',
  'Indore',
  'Visakhapatnam',
  'Coimbatore',
  'Trivandrum'
];

const internationalCities = [
  'Dubai',
  'Singapore',
  'London',
  'New York',
  'Paris',
  'Sydney',
  'Toronto',
  'Bangkok',
  'Kuala Lumpur',
  'Tokyo',
  'Frankfurt',
  'Hong Kong'
];

// Generate random integer between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate flight number based on airline
const generateFlightNumber = (airline) => {
  const prefixes = {
    'Indigo': '6E',
    'Air India': 'AI',
    'SpiceJet': 'SG',
    'Vistara': 'UK',
    'Go First': 'G8',
    'Akasa Air': 'QP',
    'AirAsia': 'AK',
    'Emirates': 'EK',
    'Qatar Airways': 'QR',
    'Singapore Airlines': 'SQ',
    'British Airways': 'BA',
    'Lufthansa': 'LH',
    'Air France': 'AF',
    'Delta': 'DL',
    'United Airlines': 'UA'
  };
  const prefix = prefixes[airline] || 'FL';
  const number = randomInt(100, 999);
  return `${prefix}${number}`;
};

// Generate departure and arrival times
const generateTimes = (source, destination, durationHours) => {
  const baseHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];
  const departureHour = baseHours[randomInt(0, baseHours.length - 1)];
  const departureMin = randomInt(0, 59);

  // Calculate arrival time
  let arrivalHour = departureHour + Math.floor(durationHours);
  let arrivalMin = departureMin + Math.floor((durationHours % 1) * 60);
  if (arrivalMin >= 60) {
    arrivalHour += 1;
    arrivalMin -= 60;
  }
  arrivalHour = arrivalHour % 24;

  const formatTime = (h, m) => {
    const hour = h.toString().padStart(2, '0');
    const minute = m.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  return {
    departureTime: formatTime(departureHour, departureMin),
    arrivalTime: formatTime(arrivalHour, arrivalMin)
  };
};

// Generate duration string
const generateDuration = (isInternational, stops) => {
  let baseHours;
  if (isInternational) {
    baseHours = stops === 0 ? randomInt(6, 12) : randomInt(10, 18);
  } else {
    baseHours = stops === 0 ? randomInt(1, 3) : randomInt(3, 6);
  }
  const minutes = randomInt(0, 59);
  const hours = Math.floor(baseHours);
  return `${hours}h ${minutes}m`;
};

// Calculate duration in hours for time generation
const getDurationHours = (durationStr) => {
  const [h, m] = durationStr.split('h');
  return parseInt(h) + (parseInt(m) / 60);
};

// Generate realistic price based on route and airline
const generatePrice = (source, destination, isInternational, airline, stops) => {
  let basePrice;

  // International routes have higher base prices
  if (isInternational) {
    basePrice = randomInt(30000, 80000);
  } else {
    basePrice = randomInt(3000, 15000);
  }

  // Adjust for airline premium
  const premiumAirlines = ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'British Airways', 'Lufthansa', 'Air France'];
  if (premiumAirlines.includes(airline)) {
    basePrice = Math.floor(basePrice * (isInternational ? 1.2 : 1.3));
  }

  // Adjust for stops (connecting flights are cheaper)
  if (stops > 0) {
    basePrice = Math.floor(basePrice * 0.85);
  }

  // Add some randomness (±15%)
  const variance = randomInt(-15, 15) / 100;
  basePrice = Math.floor(basePrice * (1 + variance));

  return Math.max(basePrice, isInternational ? 25000 : 2000); // Minimum prices
};

// Generate flights for a specific route
const generateFlightsForRoute = (source, destination, isInternational, count) => {
  const flights = [];
  const dates = [];
  const today = new Date('2026-04-01');

  // Generate dates for next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  for (let i = 0; i < count; i++) {
    const airline = airlines[randomInt(0, airlines.length - 1)];
    const stops = randomInt(0, 2); // 0, 1, or 2 stops

    // Ensure international routes use appropriate airlines
    let finalAirline = airline;
    if (isInternational) {
      // For international, prefer full-service carriers or those with codeshares
      const intlAirlines = airlines.slice(6); // Emirates, Qatar, Singapore, etc.
      if (Math.random() > 0.3) {
        finalAirline = intlAirlines[randomInt(0, intlAirlines.length - 1)];
      }
    }

    const duration = generateDuration(isInternational, stops);
    const durationHours = getDurationHours(duration);
    const { departureTime, arrivalTime } = generateTimes(source, destination, durationHours);
    const date = dates[randomInt(0, dates.length - 1)];
    const price = generatePrice(source, destination, isInternational, finalAirline, stops);

    flights.push({
      source,
      destination,
      date,
      airline: finalAirline,
      flightNumber: generateFlightNumber(finalAirline),
      price,
      duration,
      departureTime,
      arrivalTime,
      stops
    });
  }

  return flights;
};

// Generate all flights
const generateAllFlights = () => {
  const allFlights = [];

  // DOMESTIC ROUTES - Generate 3-8 flights per route pair
  const domesticRoutePairs = [];

  // Create all combinations of Indian cities (direct routes)
  for (let i = 0; i < indianCities.length; i++) {
    for (let j = 0; j < indianCities.length; j++) {
      if (i !== j) {
        domesticRoutePairs.push({
          source: indianCities[i],
          destination: indianCities[j],
          count: randomInt(20, 30)  // Increased from 3-8 to 20-30 for better date coverage
        });
      }
    }
  }

  // Use ALL domestic route pairs to ensure major routes like Mumbai-Delhi are included
  // Note: This creates 306 routes with 3-8 flights each = ~1800 domestic flights
  domesticRoutePairs.forEach(route => {
    const flights = generateFlightsForRoute(route.source, route.destination, false, route.count);
    allFlights.push(...flights);
  });

  // INTERNATIONAL ROUTES - Generate 5-12 flights per route pair
  const internationalRoutePairs = [];

  // India to International
  indianCities.forEach(indianCity => {
    internationalCities.forEach(intlCity => {
      internationalRoutePairs.push({
        source: indianCity,
        destination: intlCity,
        count: randomInt(15, 25)  // Increased from 5-12 to 15-25
      });
    });
  });

  // International to International (some routes)
  for (let i = 0; i < internationalCities.length; i++) {
    for (let j = 0; j < internationalCities.length; j++) {
      if (i !== j && Math.random() > 0.7) { // 30% chance to include
        internationalRoutePairs.push({
          source: internationalCities[i],
          destination: internationalCities[j],
          count: randomInt(10, 20)  // Increased from 3-8 to 10-20
        });
      }
    }
  }

  internationalRoutePairs.forEach(route => {
    const flights = generateFlightsForRoute(route.source, route.destination, true, route.count);
    allFlights.push(...flights);
  });

  return allFlights;
};

// ============================================
// MAIN EXECUTION
// ============================================

const seedFlights = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy');
    console.log('✅ Connected to MongoDB');

    // Clear existing flights
    const result = await Flight.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} existing flights`);

    // Generate flight data
    console.log('🔄 Generating flight data...');
    const flights = generateAllFlights();

    console.log(`📊 Generated ${flights.length} flights`);
    console.log(`   - Domestic routes: ${flights.filter(f => indianCities.includes(f.source) && indianCities.includes(f.destination)).length}`);
    console.log(`   - International routes: ${flights.filter(f => internationalCities.includes(f.source) || internationalCities.includes(f.destination)).length}`);

    // Show sample
    console.log('\n📋 Sample flights:');
    flights.slice(0, 3).forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.airline} ${f.flightNumber}: ${f.source} → ${f.destination} | ${f.departureTime}-${f.arrivalTime} | ₹${f.price} | ${f.duration} | ${f.stops} stop(s)`);
    });

    // Insert into database
    console.log('\n💾 Inserting into database...');
    await Flight.insertMany(flights);

    console.log(`\n🎉 Successfully seeded ${flights.length} flights!`);
    console.log('\n📈 Dataset summary:');
    console.log(`   Total airlines: ${new Set(flights.map(f => f.airline)).size}`);
    console.log(`   Unique routes: ${new Set(flights.map(f => `${f.source}-${f.destination}`)).size}`);

    // Price statistics
    const prices = flights.map(f => f.price);
    const avgPrice = Math.floor(prices.reduce((a, b) => a + b, 0) / prices.length);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    console.log(`   Price range: ₹${minPrice} - ₹${maxPrice} (avg: ₹${avgPrice})`);

    // Stops distribution
    const nonStop = flights.filter(f => f.stops === 0).length;
    const oneStop = flights.filter(f => f.stops === 1).length;
    const twoStop = flights.filter(f => f.stops === 2).length;
    console.log(`   Stops: Non-stop: ${nonStop}, 1-stop: ${oneStop}, 2-stop: ${twoStop}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding flights:', error);
    process.exit(1);
  }
};

seedFlights();
