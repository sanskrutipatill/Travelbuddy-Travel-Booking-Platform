import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Plane, Train, CheckCircle, XCircle, MapPin, Clock, IndianRupee,
  Star, ArrowRight, Filter
} from 'lucide-react';
import TopSearchBar from '../components/TopSearchBar';
import FilterBar from '../components/FilterBar';
import SortBar from '../components/SortBar';
import FlightList from '../components/FlightList';
import Filters from '../components/Filters';
import { AuthContext } from '../context/AuthContext';
import { handleBooking } from '../utils/handleBooking';

// Train-specific constants
const TRAIN_TYPES = ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Garib Rath', 'Jan Shatabdi', 'Duronto', 'Humsafar'];

const TIME_BUCKET_RANGES = {
  earlyMorning: { start: 0, end: 6 },
  morning: { start: 6, end: 12 },
  midDay: { start: 12, end: 16 },
  evening: { start: 16, end: 20 },
  night: { start: 20, end: 24 },
};

const SearchResults = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [flights, setFlights] = useState([]);
  const [trains, setTrains] = useState([]);
  const [isShowcaseMode, setIsShowcaseMode] = useState(false);
  const [flightSortBy, setFlightSortBy] = useState('best');
  const [trainSortBy, setTrainSortBy] = useState('recommended');
  const [bookingStatus, setBookingStatus] = useState(null);

  // Cab-specific state
  const [cabFilters, setCabFilters] = useState({
    cabTypes: [],
    minPrice: '',
    maxPrice: '',
    departureTimes: [],
    stops: [],
  });
  const [cabSortBy, setCabSortBy] = useState('recommended');

  // Get query parameters
  const source = searchParams.get('source')?.trim() || '';
  const destination = searchParams.get('destination')?.trim() || '';
  const date = searchParams.get('date') || '';
  const returnDateParam = searchParams.get('returnDate') || '';
  const passengers = parseInt(searchParams.get('passengers')) || 1;
  const travelClass = searchParams.get('class') || 'Economy';
  // Aliases for consistency (some parts may use searchFrom/searchTo)
  const searchFrom = source;
  const searchTo = destination;

  // Packages data for packages type
  const newPackages = [
    {
      id: 101,
      title: "Paris Romantic Escape",
      location: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      duration: "5 Days / 4 Nights",
      price: 75000,
      originalPrice: 95000,
      rating: 4.9,
      reviews: 1200,
      highlights: ["Eiffel Tower", "Seine Cruise", "City Tour", "Wine"],
      type: "Romantic",
      discount: "21%",
      isTopPick: true
    },
    {
      id: 102,
      title: "Maldives Luxury Retreat",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80",
      duration: "4 Days / 3 Nights",
      price: 85000,
      originalPrice: 110000,
      rating: 4.9,
      reviews: 980,
      highlights: ["Water Villa", "Snorkeling", "Spa", "Private Beach"],
      type: "Luxury",
      discount: "23%",
      isTopPick: true
    },
    {
      id: 103,
      title: "Swiss Alps Adventure",
      location: "Switzerland",
      image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
      duration: "6 Days / 5 Nights",
      price: 92000,
      originalPrice: 120000,
      rating: 4.8,
      reviews: 850,
      highlights: ["Mountains", "Cable Car", "Skiing", "Lakes"],
      type: "Adventure",
      discount: "23%",
      isTopPick: false
    },
    {
      id: 104,
      title: "Japan Cherry Blossom Tour",
      location: "Japan",
      image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80",
      duration: "6 Days / 5 Nights",
      price: 88000,
      originalPrice: 105000,
      rating: 4.9,
      reviews: 1100,
      highlights: ["Sakura", "Temples", "Tokyo Tour", "Culture"],
      type: "Cultural",
      discount: "16%",
      isTopPick: false
    },
    {
      id: 105,
      title: "New York City Explorer",
      location: "USA",
      image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
      duration: "5 Days / 4 Nights",
      price: 78000,
      originalPrice: 99000,
      rating: 4.7,
      reviews: 1350,
      highlights: ["Times Square", "Statue of Liberty", "Broadway", "City Tour"],
      type: "Urban",
      discount: "21%",
      isTopPick: false
    },
    {
      id: 106,
      title: "Iceland Northern Lights",
      location: "Iceland",
      image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80",
      duration: "5 Days / 4 Nights",
      price: 95000,
      originalPrice: 120000,
      rating: 4.9,
      reviews: 920,
      highlights: ["Aurora", "Glaciers", "Waterfalls", "Hot Springs"],
      type: "Nature",
      discount: "21%",
      isTopPick: true
    },
    {
      id: 107,
      title: "Australia Coastal Drive",
      location: "Australia",
      image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
      duration: "6 Days / 5 Nights",
      price: 87000,
      originalPrice: 110000,
      rating: 4.8,
      reviews: 780,
      highlights: ["Great Ocean Road", "Beaches", "Wildlife", "City Tour"],
      type: "Adventure",
      discount: "21%",
      isTopPick: false
    },
    {
      id: 108,
      title: "Turkey Cappadocia Dreams",
      location: "Turkey",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
      duration: "5 Days / 4 Nights",
      price: 72000,
      originalPrice: 90000,
      rating: 4.8,
      reviews: 650,
      highlights: ["Hot Air Balloon", "Caves", "Sunrise Views", "Culture"],
      type: "Romantic",
      discount: "20%",
      isTopPick: false
    }
  ];

  // Existing domestic packages
  const domesticPackages = Array.from({ length: 20 }, (_, i) => {
    const titles = [
      "Goa Beach Escape",
      "Kerala Backwaters",
      "Rajasthan Royal Tour",
      "Bali Romantic getaway",
      "Manali Snow Adventure",
      "Dubai Luxury Shopping",
      "Thailand Beach Holiday",
      "Kashmir Valley Tour",
      "Andaman Islands Getaway",
      "Himalayan Trekking",
      "Leh Ladakh Expedition",
      "Pondicherry Heritage",
      "Sikkim Mountain Retreat",
      "Meghalaya Caves Adventure",
      "Varanasi Spiritual Tour",
      "Mumbai City Lights",
      "Hyderabad Nizams Tour",
      "Gujarat Heritage Walk",
      "Tamil Nadu Temple Tour",
      "Karnataka Monuments"
    ];
    const locations = ["Goa", "Kerala", "Rajasthan", "Bali", "Manali", "Dubai", "Thailand", "Kashmir", "Andaman", "Ladakh", "Leh", "Pondicherry", "Sikkim", "Meghalaya", "Varanasi", "Mumbai", "Hyderabad", "Gujarat", "Tamil Nadu", "Karnataka"];
    const durations = ["4 Days / 3 Nights", "5 Days / 4 Nights", "6 Days / 5 Nights"];
    const imagesByLocation = {
      Goa: [
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=80"
      ],
      Kerala: [
        "https://images.unsplash.com/photo-1590059843335-2c27e07112a1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1477593621999-4bb94b87e455?auto=format&fit=crop&w=800&q=80"
      ],
      Rajasthan: [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
      ],
      Bali: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1570789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
      ],
      Manali: [
        "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80"
      ],
      Dubai: [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
      ],
      Thailand: [
        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558180077-09f158c764b9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=800&q=80"
      ],
      Kashmir: [
        "https://images.unsplash.com/photo-1587729927502-0656c9f75893?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80"
      ],
      Andaman: [
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
      ],
      Ladakh: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
      ],
      Leh: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605590423641-845885581e61?auto=format&fit=crop&w=800&q=80"
      ],
      Pondicherry: [
        "https://images.unsplash.com/photo-1524496583095-d42b4c82b4f9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1477593621999-4bb94b87e455?auto=format&fit=crop&w=800&q=80"
      ],
      Sikkim: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
      ],
      Meghalaya: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80"
      ],
      Varanasi: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
      ],
      Mumbai: [
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80"
      ],
      Hyderabad: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
      ],
      Gujarat: [
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80"
      ],
      "Tamil Nadu": [
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
      ],
      Karnataka: [
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80"
      ]
    };
    const types = ["LEISURE", "NATURE", "HERITAGE", "ROMANTIC"];

    const basePrice = 12000 + i * 1200;
    const originalPrice = Math.round(basePrice * 1.3);

    return {
      id: i + 1,
      title: titles[i % 20],
      location: locations[i % 20],
      image: imagesByLocation[locations[i % 20]][i % 4],
      duration: durations[i % 3],
      price: basePrice,
      originalPrice: originalPrice,
      rating: (4 + (i % 5) * 0.1).toFixed(1),
      reviews: Math.floor(Math.random() * 2000) + 500,
      highlights: ['Hotel Stay', 'Transfers', 'Meals', 'Sightseeing'],
      type: types[i % 4],
      discount: `${20 + (i % 10)}%`,
      isTopPick: i % 7 === 0
    };
  });

  const packages = [...newPackages, ...domesticPackages];

  const features = [
    { icon: Compass, title: 'Personalized Matching', description: 'AI-powered recommendations tailored just for you' },
    { icon: Globe, title: 'Wide Variety of Destinations', description: 'Explore 100+ destinations worldwide' },
    { icon: Shield, title: 'Highly Qualified Service', description: 'Certified professionals at every step' },
    { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock assistance wherever you travel' },
    { icon: Heart, title: 'Handpicked Hotels', description: 'Carefully selected accommodations for comfort' },
    { icon: Award, title: 'Best Price Guarantee', description: 'We match any competitor price' },
  ];

  // Cab placeholder images
  const CAB_IMAGES = [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58af?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
  ];

  // Static cabs data
  const cabs = [
    {
      id: 1,
      model: 'Maruti Swift',
      type: 'Economy',
      price: 1800,
      rating: 4.5,
      departure: '08:00',
      arrival: '12:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      model: 'Toyota Etios',
      type: 'Sedan',
      price: 2400,
      rating: 4.7,
      departure: '10:00',
      arrival: '14:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      model: 'Mahindra Scorpio',
      type: 'SUV',
      price: 3500,
      rating: 4.6,
      departure: '14:00',
      arrival: '18:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 4,
      model: 'Honda City',
      type: 'Premium',
      price: 3200,
      rating: 4.8,
      departure: '16:00',
      arrival: '20:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 5,
      model: 'Toyota Innova',
      type: 'SUV',
      price: 3800,
      rating: 4.7,
      departure: '18:00',
      arrival: '22:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58af?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 6,
      model: 'Honda Amaze',
      type: 'Economy',
      price: 1600,
      rating: 4.4,
      departure: '06:00',
      arrival: '10:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 7,
      model: 'Mercedes E-Class',
      type: 'Premium',
      price: 5500,
      rating: 4.9,
      departure: '09:00',
      arrival: '13:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 8,
      model: 'Hyundai Verna',
      type: 'Sedan',
      price: 2200,
      rating: 4.6,
      departure: '11:00',
      arrival: '15:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc0b?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 9,
      model: 'Mahindra XUV500',
      type: 'SUV',
      price: 3200,
      rating: 4.5,
      departure: '13:00',
      arrival: '17:00',
      duration: '4h',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80',
    },
  ];

  // Filter state
  const [filters, setFilters] = useState({
    stops: [],
    departureTimes: [],
    minPrice: '',
    maxPrice: '',
    airlines: [],
  });

  // Cab handlers (state already declared above)
  const handleCabCheckbox = (category, value) => {
    const current = cabFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setCabFilters((prev) => ({ ...prev, [category]: updated }));
  };

  const handleCabPriceChange = (type, value) => {
    setCabFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleCabReset = () => {
    setCabFilters({
      cabTypes: [],
      minPrice: '',
      maxPrice: '',
      departureTimes: [],
      stops: [],
    });
  };

  const getCabTimeBucket = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 0 && hour < 6) return 'earlyMorning';
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  };

  // Filtered and sorted cabs
  const filteredCabs = useMemo(() => {
    let result = [...cabs];
    if (cabFilters.cabTypes.length > 0) {
      result = result.filter((cab) => cabFilters.cabTypes.includes(cab.type));
    }
    if (cabFilters.minPrice) {
      result = result.filter((cab) => cab.price >= parseInt(cabFilters.minPrice));
    }
    if (cabFilters.maxPrice) {
      result = result.filter((cab) => cab.price <= parseInt(cabFilters.maxPrice));
    }
    if (cabFilters.departureTimes.length > 0) {
      result = result.filter((cab) => {
        const bucket = getCabTimeBucket(cab.departure);
        return cabFilters.departureTimes.includes(bucket);
      });
    }
    return result;
  }, [cabs, cabFilters]);

  const sortedCabs = useMemo(() => {
    const sorted = [...filteredCabs];
    switch (cabSortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredCabs, cabSortBy]);

  const minCabPrice = filteredCabs.length > 0 ? Math.min(...filteredCabs.map((c) => c.price)) : null;

  // Cab booking handler
  const handleBookCab = (cab) => {
    handleBooking(navigate, 'cab', cab, { passengers });
  };

  // Fetch data from API when search parameters change
  useEffect(() => {
    const fetchData = async () => {
      // Clear previous data
      setFlights([]);
      setTrains([]);
      setError(null);
      setLoading(true);

      if (type === 'flights') {
        if (source && destination && source === destination) {
          setError('Source and destination cannot be the same. Please choose different cities.');
          setLoading(false);
          return;
        }

        if (source && destination) {
          try {
            const response = await axios.get(`http://localhost:5000/api/flights`, {
              params: {
                source: source.trim(),
                destination: destination.trim(),
                date: date || undefined,
              },
            });
            setFlights(response.data);
            setIsShowcaseMode(false);
          } catch (err) {
            const errorMsg = err.response?.data?.message || `Failed to fetch flights from ${source} to ${destination}. Please try again.`;
            setError(errorMsg);
          } finally {
            setLoading(false);
          }
        } else {
          try {
            const response = await axios.get(`http://localhost:5000/api/flights/random`);
            setFlights(response.data);
            setIsShowcaseMode(true);
          } catch (err) {
            setError('Failed to load featured flights. Please try again.');
          } finally {
            setLoading(false);
          }
        }
      } else if (type === 'trains') {
        if (source && destination && source === destination) {
          setError('Source and destination cannot be the same. Please choose different cities.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(`http://localhost:5000/api/trains`, {
            params: {
              source: source.trim(),
              destination: destination.trim(),
              date: date || undefined,
            },
          });
          setTrains(response.data);
          setIsShowcaseMode(!(source && destination));
        } catch (err) {
          const errorMsg = err.response?.data?.message || `Failed to fetch trains from ${source} to ${destination}. Please try again.`;
          setError(errorMsg);
        } finally {
          setLoading(false);
        }
      } else if (type === 'cabs') {
        // Cabs data is static, no API fetch needed
        setLoading(false);
      }
      // Packages handled separately below
    };

    fetchData();
  }, [type, source, destination, date]);

  useEffect(() => {
    if (location.state?.bookingSuccess) {
      setBookingStatus({ success: true, message: location.state.message || 'Booking confirmed!' });
      setTimeout(() => {
        navigate('.', { replace: true, state: {} });
      }, 5000);
    }
  }, [location.state, navigate]);

  const filteredFlights = useMemo(() => {
    let filtered = flights;

    if (filters.stops.length > 0) {
      filtered = filtered.filter((f) => filters.stops.includes(f.stops));
    }

    if (filters.minPrice) {
      filtered = filtered.filter((f) => f.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((f) => f.price <= parseInt(filters.maxPrice));
    }

    if (filters.airlines.length > 0) {
      filtered = filtered.filter((f) => filters.airlines.includes(f.airline));
    }

    if (filters.departureTimes.length > 0) {
      filtered = filtered.filter((f) => {
        const [hour] = f.departureTime.split(':').map(Number);
        const bucket = Object.keys(TIME_BUCKET_RANGES).find((b) => {
          const { start, end } = TIME_BUCKET_RANGES[b];
          return hour >= start && hour < end;
        });
        return bucket && filters.departureTimes.includes(bucket);
      });
    }

    return filtered;
  }, [flights, filters]);

  // Filter trains (mapping stops strings to numeric filter values)
  const filteredTrains = useMemo(() => {
    let filtered = trains;

    if (filters.stops.length > 0) {
      filtered = filtered.filter((t) => {
        // Map train stop string to numeric filter value (0=Non-stop, 1=1 Stop, 2=2+)
        let numericStop;
        if (t.stops === 'Non-stop') numericStop = 0;
        else if (t.stops === '1 Stop') numericStop = 1;
        else numericStop = 2; // anything with 2 or more stops
        return filters.stops.includes(numericStop);
      });
    }

    if (filters.minPrice) {
      filtered = filtered.filter((t) => t.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((t) => t.price <= parseInt(filters.maxPrice));
    }

    if (filters.airlines.length > 0) {
      // For trains, 'airlines' filter becomes 'trainTypes'
      filtered = filtered.filter((t) => filters.airlines.includes(t.type));
    }

    if (filters.departureTimes.length > 0) {
      filtered = filtered.filter((t) => {
        const [hour] = t.departure.split(':').map(Number);
        const bucket = Object.keys(TIME_BUCKET_RANGES).find((b) => {
          const { start, end } = TIME_BUCKET_RANGES[b];
          return hour >= start && hour < end;
        });
        return bucket && filters.departureTimes.includes(bucket);
      });
    }

    return filtered;
  }, [trains, filters]);

  // Sort trains (same logic as flights)
  const sortedTrains = useMemo(() => {
    let sorted = [...filteredTrains];

    if (trainSortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (trainSortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (trainSortBy === 'departure') {
      sorted.sort((a, b) => a.departure.localeCompare(b.departure));
    } else if (trainSortBy === 'duration') {
      sorted.sort((a, b) => {
        const aDuration = parseInt(a.duration.replace('h', '').replace('m', '').split(' ')[0]) * 60 + parseInt(a.duration.match(/(\d+)m/)?.[1] || 0);
        const bDuration = parseInt(b.duration.replace('h', '').replace('m', '').split(' ')[0]) * 60 + parseInt(b.duration.match(/(\d+)m/)?.[1] || 0);
        return aDuration - bDuration;
      });
    } else if (trainSortBy === 'recommended' || trainSortBy === '') {
      // Recommended: shortest duration first, then by price
      sorted.sort((a, b) => {
        const aDuration = parseInt(a.duration.replace('h', '').replace('m', '').split(' ')[0]) * 60 + parseInt(a.duration.match(/(\d+)m/)?.[1] || 0);
        const bDuration = parseInt(b.duration.replace('h', '').replace('m', '').split(' ')[0]) * 60 + parseInt(b.duration.match(/(\d+)m/)?.[1] || 0);
        if (aDuration !== bDuration) return aDuration - bDuration;
        return a.price - b.price;
      });
    }

    return sorted;
  }, [filteredTrains, trainSortBy]);

  const handleBook = (flight) => {
    if (!user) {
      alert('Please login to book a flight');
      navigate('/login');
      return;
    }
    handleBooking(navigate, 'flight', flight, { passengers });
  };

  const handleViewDetails = (flight) => {
    const stopsText = flight.stops === 0 ? 'Non-stop' : flight.stops === 1 ? '1 Stop' : `${flight.stops} Stops`;
    alert(`Flight ${flight.flightNumber}\nAirline: ${flight.airline}\nRoute: ${flight.source} → ${flight.destination}\nDeparture: ${flight.departureTime}\nArrival: ${flight.arrivalTime}\nDuration: ${flight.duration}\nStops: ${stopsText}\nPrice: ₹${flight.price.toLocaleString('en-IN')}`);
  };

  const handleBookTrain = (train) => {
    if (!user) {
      alert('Please login to book a train');
      navigate('/login');
      return;
    }
    // Navigate to checkout page with train data
    handleBooking(navigate, 'train', train, { passengers });
  };

  const handleViewTrainDetails = (train) => {
    alert(`Train ${train.trainNumber}\nName: ${train.name}\nRoute: ${train.source} → ${train.destination}\nDeparture: ${train.departure}\nArrival: ${train.arrival}\nDuration: ${train.duration}\nStops: ${train.stops}\nClass: ${train.class}\nPrice: ₹${train.price.toLocaleString('en-IN')}`);
  };

  const handlePackageBook = (pkg) => {
    handleBooking(navigate, 'package', pkg, { passengers });
  };

  // Helper functions (must be inside component to access state)
  const getRouteTitle = () => {
    if (isShowcaseMode) {
      return type === 'trains' ? 'Explore Popular Trains' : 'Explore Popular Flights';
    }
    const src = source || 'Delhi';
    const dest = destination || 'Mumbai';
    return `${src} → ${dest}`;
  };

  const getSubtitle = () => {
    const count = type === 'trains' ? filteredTrains.length : filteredFlights.length;
    const item = type === 'trains' ? 'train' : 'flight';
    if (isShowcaseMode) {
      return `Discover our featured ${type === 'trains' ? 'trains' : 'flights'} across India`;
    }
    return `${count} ${item}s available${source && destination && source !== destination && ` from ${source} to ${destination}`}`;
  };

  // Render Packages UI
  if (type === 'packages') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/10 to-purple-50/10">
        {/* Wave Divider SVG */}
        <svg className="absolute bottom-0 left-0 w-full h-24 text-gray-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>

        {/* HERO SECTION */}
        <section className="relative h-[40vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=100"
            alt="Travel Hero"
            className="absolute w-full h-full object-cover scale-105 blur-[2px]"
          />
          <div className="absolute inset-0 bg-white/70"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-white"></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
              Explore Dream Packages
            </h1>
            <p className="mt-2 text-base md:text-lg text-white/90">
              Discover handpicked travel experiences crafted just for you
            </p>
          </div>
        </section>


        {/* BEST OFFERS SECTION */}
        <section className="py-16 px-4 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Best Offers</h2>
              <p className="text-lg text-gray-600">Exclusive deals you won't find elsewhere</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {domesticPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-blue-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{pkg.type}</span>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">{pkg.rating}</span>
                        <span className="text-xs text-gray-400">({pkg.reviews})</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {pkg.title}
                    </h3>

                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.location}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-400 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                        <div className="flex items-baseline space-x-1">
                          <IndianRupee className="h-4 w-4 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">{pkg.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-400">per person</p>
                      </div>
                      <button
                        onClick={() => handlePackageBook(pkg)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ALL PACKAGES SECTION */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">All Packages</h2>
              <p className="text-lg text-gray-600">Curated experiences for every type of traveler</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
                      {pkg.type}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {pkg.title}
                    </h3>

                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.location}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-400 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-md font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                        <div className="flex items-baseline space-x-1">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                          <span className="text-xl font-bold text-gray-900">{pkg.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-400">per person</p>
                      </div>
                      <button
                        onClick={() => handlePackageBook(pkg)}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 px-4 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Choose TravelBuddy?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We go above and beyond to make your travel dreams come true with premium services and unforgettable experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" className="text-gray-50" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>
    );
  };

  // Not supported types
  if (type !== 'flights' && type !== 'trains' && type !== 'cabs') {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopSearchBar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{type} Search</h1>
          <p className="text-gray-600 mt-2">This service type is not yet supported.</p>
        </div>
      </div>
    );
  }

  // Main results page (Google Flights layout)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Top Search Bar */}
      <TopSearchBar
        initialValues={{
          source,
          destination,
          date: date,
          returnDate: returnDateParam,
          class: travelClass,
          passengers: passengers
        }}
      />

      {/* Booking Status Alert */}
      {bookingStatus && (
        <div className={`max-w-7xl mx-auto px-4 mt-2 ${bookingStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-2 flex items-center gap-2 text-sm`}>
          {bookingStatus.success ?
            <CheckCircle className="h-4 w-4 text-green-600" /> :
            <XCircle className="h-4 w-4 text-red-600" />
          }
          <span className={bookingStatus.success ? 'text-green-800' : 'text-red-800'}>
            {bookingStatus.message}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Error Messages */}
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-sm">
            <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {!error && source && destination && source === destination && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-sm">
            <XCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="text-amber-800">Source and destination cannot be the same.</span>
          </div>
        )}

        {/* Horizontal Filter Bar */}
        <FilterBar
          flights={filteredFlights}
          activeFilters={{}}
          onFilterChange={() => {}}
        />

        {/* Sort Bar - only for flights */}
        {type === 'flights' && (
          <SortBar
            flights={filteredFlights}
            currentSort={flightSortBy}
            onSortChange={setFlightSortBy}
          />
        )}

        {/* Results Header */}
        <div className="mt-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-md">
              {type === 'trains' ?
                <Train className="h-5 w-5 text-blue-600" /> :
                <Plane className="h-5 w-5 text-blue-600" />
              }
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {type === 'flights' || type === 'trains' ? getRouteTitle() : ''}
              </h1>
              <p className="text-xs text-gray-600">
                {type === 'trains' ? filteredTrains.length : filteredFlights.length} {' '}
                {type === 'trains' ? (filteredTrains.length === 1 ? 'train' : 'trains') : (filteredFlights.length === 1 ? 'flight' : 'flights')} found
              </p>
            </div>
            {/* Mobile filter button for trains and cabs */}
            {type !== 'flights' && (
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden ml-auto flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main>
          {type === 'flights' ? (
            <FlightList
              flights={filteredFlights}
              sortBy={flightSortBy}
              onSortChange={setFlightSortBy}
              onBook={handleBook}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          ) : type === 'trains' ? (
            // Train results (keep existing UI with its own sort dropdown)
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{sortedTrains.length}</span> trains available
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={trainSortBy}
                    onChange={(e) => setTrainSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="departure">Departure</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : sortedTrains.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Train className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No trains found</h3>
                  <p className="text-sm text-gray-600 mb-4">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedTrains.map((train) => (
                    <div
                      key={train._id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col lg:flex-row items-start lg:items-center gap-4"
                    >
                      {/* Train card - same as before */}
                      <div className="flex items-center gap-3 w-full lg:w-auto lg:min-w-[180px]">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Train className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{train.name}</div>
                          <div className="text-xs text-gray-500">{train.trainNumber}</div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                        <div className="text-center sm:text-left min-w-[60px]">
                          <div className="text-lg font-bold text-gray-900">{train.departure}</div>
                          <div className="text-sm text-gray-600 font-medium truncate">{train.source}</div>
                        </div>

                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div className="text-xs text-gray-500">{train.duration}</div>
                          <div className="relative w-20 sm:w-28 h-px bg-gray-300">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-300 rounded-full" />
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            {train.stops}
                          </div>
                        </div>

                        <div className="text-center sm:text-left min-w-[60px]">
                          <div className="text-lg font-bold text-gray-900">{train.arrival}</div>
                          <div className="text-sm text-gray-600 font-medium truncate">{train.destination}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full lg:w-auto gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-4 mt-1">
                        <div className="flex-shrink-0">
                          <div className="text-xl font-extrabold text-gray-900">₹{train.price.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                        <button
                          onClick={() => handleBookTrain(train)}
                          className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2 text-sm font-semibold rounded shadow-sm hover:shadow transition-all"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : type === 'cabs' ? (
            // Cabs results (keep existing)
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{sortedCabs.length}</span> cabs available
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={cabSortBy}
                    onChange={(e) => setCabSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {sortedCabs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCabs.map((cab, idx) => (
                    <div
                      key={cab.id}
                      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative h-40 overflow-hidden rounded-t-xl">
                        <img
                          src={cab.image || CAB_IMAGES[idx % CAB_IMAGES.length]}
                          alt={cab.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = CAB_IMAGES[0];
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                          {cab.type}
                        </div>
                        {cab.rating >= 4.5 && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-gray-900 flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{cab.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                          {cab.type} Ride - {cab.model}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {source || 'Pickup'} → {destination || 'Drop'} • {cab.duration} • {cab.departure} - {cab.arrival}
                        </p>
                        {cab.price === minCabPrice && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded">
                              Best Price
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div>
                            <div className="flex items-center space-x-1">
                              <IndianRupee className="h-4 w-4 text-gray-400" />
                              <span className="text-lg font-bold text-gray-900">{cab.price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400">one-way fare</p>
                          </div>
                          <button
                            onClick={() => handleBookCab(cab)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded shadow-sm hover:shadow transition-all"
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                  <p className="text-gray-500">No cabs match your filters. Try adjusting them.</p>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {type === 'cabs' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                    <button onClick={handleCabReset} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Clear All
                    </button>
                  </div>
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Cab Types</h3>
                    <div className="space-y-2">
                      {['Economy', 'Sedan', 'SUV', 'Premium', 'Airport Transfer', 'Outstation'].map((type) => (
                        <label key={type} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={cabFilters.cabTypes?.includes(type) || false}
                            onChange={() => handleCabCheckbox('cabTypes', type)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Departure Time</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'earlyMorning', label: 'Early Morning' },
                        { id: 'morning', label: 'Morning' },
                        { id: 'afternoon', label: 'Afternoon' },
                        { id: 'evening', label: 'Evening' },
                        { id: 'night', label: 'Night' },
                      ].map((time) => (
                        <label key={time.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={cabFilters.departureTimes?.includes(time.id) || false}
                            onChange={() => handleCabCheckbox('departureTimes', time.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">{time.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Price Range</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={cabFilters.minPrice}
                          onChange={(e) => handleCabPriceChange('minPrice', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <span className="text-gray-400 text-sm">-</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Max"
                          value={cabFilters.maxPrice}
                          onChange={(e) => handleCabPriceChange('maxPrice', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Stops</h3>
                    <div className="space-y-2">
                      {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
                        <label key={stop} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={cabFilters.stops?.includes(stop) || false}
                            onChange={() => handleCabCheckbox('stops', stop)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">{stop}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Filters
                  filters={filters}
                  onFilterChange={(category, value) => setFilters((prev) => ({ ...prev, [category]: value }))}
                  availableAirlines={type === 'trains' ? TRAIN_TYPES : ['Indigo', 'Air India', 'SpiceJet', 'Vistara', 'Go First', 'Akasa Air', 'AirAsia']}
                  serviceType={type}
                />
              )}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
