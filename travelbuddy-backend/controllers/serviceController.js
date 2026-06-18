const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Train = require('../models/Train');
const Cab = require('../models/Cab');
const Package = require('../models/Package');

// @desc    Get random flights (for showcase/landing)
// @route   GET /api/flights/random
const getRandomFlights = async (req, res) => {
  try {
    // Get up to 10 random flights from the database
    const flights = await Flight.aggregate([
      { $sample: { size: 10 } }
    ]);
    res.json(flights);
  } catch (error) {
    console.error('❌ Error fetching random flights:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get flights
// @route   GET /api/flights
const getFlights = async (req, res) => {
  try {
    const { source, destination, date, sortBy, order } = req.query;

    console.log('🔍 Flight Search API called with:', { source, destination, date, sortBy, order });

    let query = {};
    if (source) {
      query.source = { $regex: source, $options: 'i' };
      console.log('  - Source regex:', query.source);
    }
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
      console.log('  - Destination regex:', query.destination);
    }
    if (date) {
      const searchDate = new Date(date);
      if (!isNaN(searchDate)) {
        query.date = {
          $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59, 999))
        };
        console.log('  - Date range:', query.date);
      } else {
        console.log('  - Invalid date format, ignoring date filter');
      }
    }

    console.log('  - Final MongoDB query:', JSON.stringify(query, null, 2));

    // Build sort object
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'price':
          sortOptions = { price: sortOrder };
          break;
        case 'duration':
          // Duration is stored as string like "2h 30m". Need to convert to minutes for sorting
          // Using aggregation would be better, but for now we'll sort in-memory after fetch for duration
          break;
        case 'departure':
          sortOptions = { departureTime: sortOrder };
          break;
        case 'recommended':
        default:
          // Recommended: shortest duration first, then by price
          sortOptions = { duration: 1, price: 1 };
          break;
      }
    }

    let flights = await Flight.find(query);

    // Apply duration-based sorting in-memory if needed (since duration is a string)
    if (sortBy === 'duration' || sortBy === 'recommended') {
      const getMinutes = (dur) => {
        const h = dur.match(/(\d+)h/);
        const m = dur.match(/(\d+)m/);
        return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
      };
      flights.sort((a, b) => {
        const aMin = getMinutes(a.duration);
        const bMin = getMinutes(b.duration);
        if (aMin !== bMin) {
          return sortBy === 'duration' ? (order === 'desc' ? bMin - aMin : aMin - bMin) : aMin - bMin;
        }
        // If same duration, sort by price ascending (for recommended)
        return order === 'desc' ? b.price - a.price : a.price - b.price;
      });
    } else if (Object.keys(sortOptions).length > 0) {
      flights.sort((a, b) => {
        const valA = sortOptions[Object.keys(sortOptions)[0]] > 0 ? a[Object.keys(sortOptions)[0]] : b[Object.keys(sortOptions)[0]];
        const valB = sortOptions[Object.keys(sortOptions)[0]] > 0 ? b[Object.keys(sortOptions)[0]] : a[Object.keys(sortOptions)[0]];
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });
    }

    console.log(`✅ Found ${flights.length} flights`);

    // Log first few results for verification
    if (flights.length > 0) {
      console.log('  - Sample flight:', {
        id: flights[0]._id,
        source: flights[0].source,
        destination: flights[0].destination,
        date: flights[0].date,
        departureTime: flights[0].departureTime,
        airline: flights[0].airline,
        price: flights[0].price
      });
    }

    res.json(flights);
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hotels
// @route   GET /api/hotels
const getHotels = async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};
    if (location) query.location = new RegExp(location, 'i');
    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trains
// @route   GET /api/trains
const getTrains = async (req, res) => {
  try {
    const { source, destination, date, sortBy, order } = req.query;
    let query = {};
    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');
    if (date) {
      const searchDate = new Date(date);
      if (!isNaN(searchDate)) {
        query.date = {
          $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59, 999))
        };
      }
    }

    let trains = await Train.find(query);

    // Apply sorting
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      if (sortBy === 'price') {
        trains.sort((a, b) => sortOrder === 1 ? a.price - b.price : b.price - a.price);
      } else if (sortBy === 'duration') {
        const getMinutes = (dur) => {
          const h = dur.match(/(\d+)h/);
          const m = dur.match(/(\d+)m/);
          return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
        };
        trains.sort((a, b) => {
          const aMin = getMinutes(a.duration);
          const bMin = getMinutes(b.duration);
          return sortOrder === 1 ? aMin - bMin : bMin - aMin;
        });
      } else if (sortBy === 'departure') {
        trains.sort((a, b) => sortOrder === 1 ? a.departure.localeCompare(b.departure) : b.departure.localeCompare(a.departure));
      } else if (sortBy === 'recommended') {
        // Recommended: shortest duration first, then by price
        const getMinutes = (dur) => {
          const h = dur.match(/(\d+)h/);
          const m = dur.match(/(\d+)m/);
          return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
        };
        trains.sort((a, b) => {
          const aMin = getMinutes(a.duration);
          const bMin = getMinutes(b.duration);
          if (aMin !== bMin) return aMin - bMin;
          return a.price - b.price;
        });
      }
    }

    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cabs
// @route   GET /api/cabs
const getCabs = async (req, res) => {
  try {
    const { pickup, drop } = req.query;
    let query = {};
    if (pickup) query.pickup = new RegExp(pickup, 'i');
    if (drop) query.drop = new RegExp(drop, 'i');
    const cabs = await Cab.find(query);
    res.json(cabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get packages
// @route   GET /api/packages
const getPackages = async (req, res) => {
  try {
    const { location, type } = req.query;
    let query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (type) query.type = new RegExp(type, 'i');
    const packages = await Package.find(query);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFlights,
  getHotels,
  getTrains,
  getCabs,
  getRandomFlights,
  getPackages
};
