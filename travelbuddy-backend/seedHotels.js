/**
 * TRAVELBUDDY - HOTEL DATA SEEDER
 * Generates 500+ realistic hotels worldwide
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('./models/Hotel');

dotenv.config();

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Indian cities
const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Goa', 'Kochi', 'Bhubaneswar', 'Lucknow', 'Chandigarh',
  'Indore', 'Visakhapatnam', 'Coimbatore', 'Trivandrum', 'Mysore', 'Udaipur',
  'Jodhpur', 'Amritsar', 'Varanasi', 'Rishikesh', 'Manali', 'Shimla', 'Darjeeling'
];

// International cities
const internationalCities = [
  'Dubai', 'Singapore', 'London', 'New York', 'Paris', 'Sydney', 'Toronto',
  'Bangkok', 'Kuala Lumpur', 'Tokyo', 'Frankfurt', 'Hong Kong', 'Rome', 'Barcelona',
  'Amsterdam', 'Berlin', 'Moscow', 'Beijing', 'Seoul', 'Melbourne', 'Auckland',
  'Vancouver', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas', 'San Francisco',
  'Cairo', 'Istanbul', 'Athens', 'Madrid', 'Lisbon', 'Vienna', 'Prague'
];

// All cities combined
const allCities = [...indianCities, ...internationalCities];

// Property types
const propertyTypes = ['Hotel', 'Villa', 'Resort', 'Apartment', 'Boutique', 'Guest House'];

// Amenities pools
const amenityPools = {
  'Budget': ['Free WiFi', 'Parking', 'AC', 'Housekeeping'],
  'Standard': ['Free WiFi', 'Parking', 'AC', 'Swimming Pool', 'Gym', 'Restaurant', 'Room Service'],
  'Premium': ['Free WiFi', 'Valet Parking', 'AC', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service', 'Business Center', 'Concierge'],
  'Luxury': ['Free WiFi', 'Valet Parking', 'AC', 'Rooftop Pool', 'Full Spa', 'Fine Dining', '24/7 Room Service', 'Butler Service', 'Airport Transfer', 'Club Lounge', 'Fitness Center']
};

// Hotel name prefixes and suffixes for variety
const namePrefixes = ['Grand', 'Royal', 'Premier', 'Elite', 'Sunset', 'Ocean', 'City', 'Palace', 'Regency', 'Crown', 'Majestic', 'Golden', 'Silver', 'Diamond', 'Platinum', 'The', 'Luxury', 'Budget', 'Comfort', 'Cozy'];
const nameSuffixes = ['Hotel', 'Resort', 'Inn', 'Suites', 'Palace', 'Mansion', 'Heights', 'View', 'Plaza', 'Center', 'House', 'Retreat', 'Escape', 'Haven', 'Oasis'];

// Indian-themed names
const indianThemes = ['Taj', 'Maurya', 'Rajput', 'Mughal', 'Saffron', 'Spice', 'Chai', 'Yoga', 'Ayurveda', 'Ganga', 'Yamuna', 'Brahmaputra'];

// Generate hotel name
const generateHotelName = (city, isIndian) => {
  if (isIndian && Math.random() > 0.5) {
    const theme = indianThemes[randomInt(0, indianThemes.length - 1)];
    const suffix = ['Hotel', 'Resort', 'Palace'][randomInt(0, 2)];
    return `${theme} ${suffix}`;
  }
  const prefix = namePrefixes[randomInt(0, namePrefixes.length - 1)];
  const suffix = nameSuffixes[randomInt(0, nameSuffixes.length - 1)];
  return `${prefix} ${suffix}`;
};

// Generate amenities based on price range
const generateAmenities = (price) => {
  if (price < 3000) return [...amenityPools.Budget];
  if (price < 8000) return [...amenityPools.Standard];
  if (price < 20000) return [...amenityPools.Premium];
  return [...amenityPools.Luxury];
};

// Generate hotels for a city
const generateHotelsForCity = (city, count) => {
  const hotels = [];
  const isIndian = indianCities.includes(city);

  for (let i = 0; i < count; i++) {
    const propertyType = propertyTypes[randomInt(0, propertyTypes.length - 1)];
    const name = generateHotelName(city, isIndian);

    // Price based on city tier and property type
    let basePrice;
    if (isIndian) {
      basePrice = randomInt(1500, 25000);
    } else {
      basePrice = randomInt(3000, 50000);
    }

    // Adjust for property type
    const typeMultiplier = {
      'Hotel': 1,
      'Villa': 1.5,
      'Resort': 1.8,
      'Apartment': 0.8,
      'Boutique': 1.3,
      'Guest House': 0.6
    };
    basePrice = Math.floor(basePrice * (typeMultiplier[propertyType] || 1));

    // Rating: mostly 3-5, with some lower
    let rating;
    const ratingRoll = Math.random();
    if (ratingRoll > 0.9) rating = randomInt(30, 39) / 10; // 3.0-3.9 (10%)
    else if (ratingRoll > 0.3) rating = randomInt(40, 49) / 10; // 4.0-4.9 (60%)
    else rating = randomInt(50, 52) / 10; // 5.0-5.2 (30%)
    rating = Math.round(rating * 10) / 10;

    // Reviews count based on rating
    const reviewsBase = rating >= 4.5 ? randomInt(500, 3000) :
                       rating >= 4.0 ? randomInt(200, 1000) :
                       randomInt(50, 500);

    // Discount chance
    const hasDiscount = Math.random() > 0.7;
    const discount = hasDiscount ? randomInt(5, 25) : 0;
    const discountedPrice = Math.floor(basePrice * (1 - discount / 100));

    // Build amenities
    const amenities = generateAmenities(basePrice);
    if (Math.random() > 0.8) amenities.push('Free Cancellation');
    if (Math.random() > 0.7) amenities.push('Pet Friendly');

    // Image - Dynamic Unsplash based on location and property type
    const locationSlug = city.toLowerCase().replace(/\s+/g, '-');
    const image = `https://source.unsplash.com/400x300/?${propertyType.toLowerCase()},${locationSlug}`;

    hotels.push({
      name,
      location: city,
      price: discountedPrice,
      originalPrice: hasDiscount ? basePrice : null,
      rating,
      reviews: reviewsBase,
      amenities,
      propertyType,
      image,
      imageUrl: image, // Also set imageUrl for compatibility
      description: `Experience ${isIndian ? 'Indian' : 'international'} hospitality at its finest in the heart of ${city}. ${propertyType} offering comfort, luxury, and convenience.`
    });
  }

  return hotels;
};

// Main generation
const generateAllHotels = () => {
  const allHotels = [];

  // Generate hotels for each city
  allCities.forEach(city => {
    // Vary count by city size/popularity
    let count;
    if (indianCities.includes(city)) {
      // Indian cities: 15-25 hotels each
      count = randomInt(15, 25);
    } else {
      // International: 10-20 hotels each
      count = randomInt(10, 20);
    }

    // Some cities get extra (major tourist hubs)
    const extraCities = ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Dubai', 'London', 'New York', 'Paris', 'Bangkok', 'Singapore'];
    if (extraCities.includes(city)) {
      count += randomInt(10, 20);
    }

    const hotels = generateHotelsForCity(city, count);
    allHotels.push(...hotels);
  });

  // Additional standalone luxury hotels (no city-specific generation)
  for (let i = 0; i < 100; i++) {
    const city = allCities[randomInt(0, allCities.length - 1)];
    const isIndian = indianCities.includes(city);
    const hotel = generateHotelsForCity(city, 1)[0];
    allHotels.push(hotel);
  }

  return allHotels;
};

// Seed
const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelbuddy');
    console.log('✅ Connected to MongoDB');

    // Clear existing hotels
    const result = await Hotel.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} existing hotels`);

    // Generate data
    console.log('🔄 Generating hotel data...');
    const hotels = generateAllHotels();

    console.log(`📊 Generated ${hotels.length} hotels`);
    console.log(`   - Indian cities: ${hotels.filter(h => indianCities.includes(h.location)).length}`);
    console.log(`   - International: ${hotels.filter(h => internationalCities.includes(h.location)).length}`);

    // Sample output
    console.log('\n📋 Sample hotels:');
    hotels.slice(0, 5).forEach((h, i) => {
      console.log(`  ${i + 1}. ${h.name} (${h.location})`);
      console.log(`     ₹${h.price}${h.originalPrice ? ` (was ₹${h.originalPrice})` : ''} | ⭐${h.rating} (${h.reviews} reviews) | ${h.propertyType}`);
      console.log(`     Amenities: ${h.amenities.slice(0, 4).join(', ')}${h.amenities.length > 4 ? '...' : ''}`);
    });

    // Insert
    console.log('\n💾 Inserting into database...');
    await Hotel.insertMany(hotels);

    console.log(`\n🎉 Successfully seeded ${hotels.length} hotels!`);

    // Statistics
    const stats = await Hotel.aggregate([
      { $group: {
        _id: '$location',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log('\n🏙️  Top 10 cities by hotel count:');
    stats.forEach(s => console.log(`  ${s._id}: ${s.count} hotels (avg: ₹${Math.round(s.avgPrice)})`));

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedHotels();
