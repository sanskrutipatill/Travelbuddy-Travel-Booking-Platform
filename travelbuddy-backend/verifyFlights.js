const mongoose = require('mongoose');
const Flight = require('./models/Flight');
require('dotenv').config();

const verifyFlights = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy');
    console.log('Connected to MongoDB\n');

    // Total count
    const total = await Flight.countDocuments();
    console.log(`📊 Total flights in database: ${total}`);

    // Count by source
    const sources = await Flight.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    console.log('\n🔝 Top 10 sources:');
    sources.forEach(s => console.log(`  ${s._id}: ${s.count} flights`));

    // Count by destination
    const destinations = await Flight.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    console.log('\n🔝 Top 10 destinations:');
    destinations.forEach(d => console.log(`  ${d._id}: ${d.count} flights`));

    // Check Mumbai to Delhi specifically
    const mumbaiToDelhi = await Flight.find({
      source: { $regex: 'mumbai', $options: 'i' },
      destination: { $regex: 'delhi', $options: 'i' }
    }).limit(5);
    console.log(`\n✈️  Mumbai → Delhi flights: ${mumbaiToDelhi.length}`);
    if (mumbaiToDelhi.length > 0) {
      console.log('  Sample:');
      mumbaiToDelhi.slice(0, 3).forEach(f => {
        console.log(`    ${f.airline} ${f.flightNumber}: ${f.source} → ${f.destination} | ${f.date} | ${f.departureTime}-${f.arrivalTime} | ₹${f.price}`);
      });
    }

    // Check date range
    const dateRange = await Flight.aggregate([
      { $group: {
        _id: null,
        minDate: { $min: '$date' },
        maxDate: { $max: '$date' }
      }}
    ]);
    console.log('\n📅 Date range:');
    console.log(`  Earliest: ${dateRange[0].minDate}`);
    console.log(`  Latest: ${dateRange[0].maxDate}`);

    // Check unique routes count
    const routes = await Flight.aggregate([
      { $group: { _id: { source: '$source', destination: '$destination' } } },
      { $count: 'uniqueRoutes' }
    ]);
    console.log(`\n🛣️  Unique routes: ${routes[0]?.uniqueRoutes || 0}`);

    // Price range
    const priceStats = await Flight.aggregate([
      { $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' }
      }}
    ]);
    console.log('\n💰 Price statistics:');
    console.log(`  Min: ₹${Math.round(priceStats[0].minPrice)}`);
    console.log(`  Max: ₹${Math.round(priceStats[0].maxPrice)}`);
    console.log(`  Avg: ₹${Math.round(priceStats[0].avgPrice)}`);

    // Sample flights from Mumbai
    const mumbaiFlights = await Flight.find({ source: { $regex: 'mumbai', $options: 'i' } }).limit(5);
    console.log(`\n✈️  Sample flights from Mumbai (${mumbaiFlights.length} shown):`);
    mumbaiFlights.forEach(f => {
      console.log(`  ${f.airline} ${f.flightNumber}: ${f.source} → ${f.destination} | ${f.departureTime}-${f.arrivalTime} | ₹${f.price} | ${f.stops} stop(s)`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Verification complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyFlights();
