const express = require('express');
const router = express.Router();
const { getFlights, getHotels, getTrains, getCabs, getRandomFlights, getPackages } = require('../controllers/serviceController');

router.get('/flights', getFlights);
router.get('/flights/random', getRandomFlights);
router.get('/hotels', getHotels);
router.get('/trains', getTrains);
router.get('/cabs', getCabs);
router.get('/packages', getPackages);

module.exports = router;
