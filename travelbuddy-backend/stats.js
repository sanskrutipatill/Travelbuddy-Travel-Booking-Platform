const mongoose = require('mongoose');
const Flight = require('./models/Flight');
require('dotenv').config();

const showRouteStats = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy');

  console.log('\n📊 ROUTE STATISTICS (Top 20 by flight count)\n');
  console.log('Route | Count | Sample Prices');
  console.log('-----|-------|--------------');

  const stats = await Flight.aggregate([
    {
      $group: {
        _id: { source: '$source', destination: '$destination' },
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  stats.forEach(s => {
    console.log(`${s._id.source} → ${s._id.destination} | ${s.count} flights | ₹${Math.round(s.minPrice)}-₹${Math.round(s.maxPrice)} (avg: ₹${Math.round(s.avgPrice)})`);
  });

  console.log('\n🔍 Check specific route:');
  const route = await Flight.find({
    source: { $regex: 'mumbai', $options: 'i' },
    destination: { $regex: 'delhi', $options: 'i' }
  }).countDocuments();
  console.log(`Mumbai → Delhi: ${route} flights`);

  await mongoose.disconnect();
};

showRouteStats();
