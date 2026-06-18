import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/SearchResults.jsx?t=1775400967008173000");import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=9afabed4"; const React = __vite__cjsImport0_react; const useEffect = __vite__cjsImport0_react["useEffect"]; const useState = __vite__cjsImport0_react["useState"]; const useMemo = __vite__cjsImport0_react["useMemo"]; const useContext = __vite__cjsImport0_react["useContext"];
import { useParams, useSearchParams, useNavigate, useLocation } from "/node_modules/.vite/deps/react-router-dom.js?v=9afabed4";
import axios from "/node_modules/.vite/deps/axios.js?v=9afabed4";
import { Plane, Train, CheckCircle, XCircle, MapPin, Clock, IndianRupee, Star, ArrowRight, Filter } from "/node_modules/.vite/deps/lucide-react.js?v=9afabed4";
import TopSearchBar from "/src/components/TopSearchBar.jsx";
import FilterBar from "/src/components/FilterBar.jsx";
import SortBar from "/src/components/SortBar.jsx";
import FlightList from "/src/components/FlightList.jsx";
import Filters from "/src/components/Filters.jsx";
import { AuthContext } from "/src/context/AuthContext.jsx";
import { handleBooking } from "/src/utils/handleBooking.js";
var _jsxFileName = "C:/Users/aksha/Downloads/Travel Booking System/travelbuddy-frontend/src/pages/SearchResults.jsx?t=1775400967008173000";
import __vite__cjsImport11_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=9afabed4"; const _jsxDEV = __vite__cjsImport11_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
// Train-specific constants
const TRAIN_TYPES = [
	"Express",
	"Superfast",
	"Rajdhani",
	"Shatabdi",
	"Garib Rath",
	"Jan Shatabdi",
	"Duronto",
	"Humsafar"
];
const TIME_BUCKET_RANGES = {
	earlyMorning: {
		start: 0,
		end: 6
	},
	morning: {
		start: 6,
		end: 12
	},
	midDay: {
		start: 12,
		end: 16
	},
	evening: {
		start: 16,
		end: 20
	},
	night: {
		start: 20,
		end: 24
	}
};
const SearchResults = () => {
	_s();
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
	const [flightSortBy, setFlightSortBy] = useState("best");
	const [trainSortBy, setTrainSortBy] = useState("recommended");
	const [bookingStatus, setBookingStatus] = useState(null);
	// Cab-specific state
	const [cabFilters, setCabFilters] = useState({
		cabTypes: [],
		minPrice: "",
		maxPrice: "",
		departureTimes: [],
		stops: []
	});
	const [cabSortBy, setCabSortBy] = useState("recommended");
	// Get query parameters
	const source = searchParams.get("source")?.trim() || "";
	const destination = searchParams.get("destination")?.trim() || "";
	const date = searchParams.get("date") || "";
	const returnDateParam = searchParams.get("returnDate") || "";
	const passengers = parseInt(searchParams.get("passengers")) || 1;
	const travelClass = searchParams.get("class") || "Economy";
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
			price: 75e3,
			originalPrice: 95e3,
			rating: 4.9,
			reviews: 1200,
			highlights: [
				"Eiffel Tower",
				"Seine Cruise",
				"City Tour",
				"Wine"
			],
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
			price: 85e3,
			originalPrice: 11e4,
			rating: 4.9,
			reviews: 980,
			highlights: [
				"Water Villa",
				"Snorkeling",
				"Spa",
				"Private Beach"
			],
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
			price: 92e3,
			originalPrice: 12e4,
			rating: 4.8,
			reviews: 850,
			highlights: [
				"Mountains",
				"Cable Car",
				"Skiing",
				"Lakes"
			],
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
			price: 88e3,
			originalPrice: 105e3,
			rating: 4.9,
			reviews: 1100,
			highlights: [
				"Sakura",
				"Temples",
				"Tokyo Tour",
				"Culture"
			],
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
			price: 78e3,
			originalPrice: 99e3,
			rating: 4.7,
			reviews: 1350,
			highlights: [
				"Times Square",
				"Statue of Liberty",
				"Broadway",
				"City Tour"
			],
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
			price: 95e3,
			originalPrice: 12e4,
			rating: 4.9,
			reviews: 920,
			highlights: [
				"Aurora",
				"Glaciers",
				"Waterfalls",
				"Hot Springs"
			],
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
			price: 87e3,
			originalPrice: 11e4,
			rating: 4.8,
			reviews: 780,
			highlights: [
				"Great Ocean Road",
				"Beaches",
				"Wildlife",
				"City Tour"
			],
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
			price: 72e3,
			originalPrice: 9e4,
			rating: 4.8,
			reviews: 650,
			highlights: [
				"Hot Air Balloon",
				"Caves",
				"Sunrise Views",
				"Culture"
			],
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
		const locations = [
			"Goa",
			"Kerala",
			"Rajasthan",
			"Bali",
			"Manali",
			"Dubai",
			"Thailand",
			"Kashmir",
			"Andaman",
			"Ladakh",
			"Leh",
			"Pondicherry",
			"Sikkim",
			"Meghalaya",
			"Varanasi",
			"Mumbai",
			"Hyderabad",
			"Gujarat",
			"Tamil Nadu",
			"Karnataka"
		];
		const durations = [
			"4 Days / 3 Nights",
			"5 Days / 4 Nights",
			"6 Days / 5 Nights"
		];
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
		const types = [
			"LEISURE",
			"NATURE",
			"HERITAGE",
			"ROMANTIC"
		];
		const basePrice = 12e3 + i * 1200;
		const originalPrice = Math.round(basePrice * 1.3);
		return {
			id: i + 1,
			title: titles[i % 20],
			location: locations[i % 20],
			image: imagesByLocation[locations[i % 20]][i % 4],
			duration: durations[i % 3],
			price: basePrice,
			originalPrice,
			rating: (4 + i % 5 * .1).toFixed(1),
			reviews: Math.floor(Math.random() * 2e3) + 500,
			highlights: [
				"Hotel Stay",
				"Transfers",
				"Meals",
				"Sightseeing"
			],
			type: types[i % 4],
			discount: `${20 + i % 10}%`,
			isTopPick: i % 7 === 0
		};
	});
	const packages = [...newPackages, ...domesticPackages];
	const features = [
		{
			icon: Compass,
			title: "Personalized Matching",
			description: "AI-powered recommendations tailored just for you"
		},
		{
			icon: Globe,
			title: "Wide Variety of Destinations",
			description: "Explore 100+ destinations worldwide"
		},
		{
			icon: Shield,
			title: "Highly Qualified Service",
			description: "Certified professionals at every step"
		},
		{
			icon: Headphones,
			title: "24/7 Support",
			description: "Round-the-clock assistance wherever you travel"
		},
		{
			icon: Heart,
			title: "Handpicked Hotels",
			description: "Carefully selected accommodations for comfort"
		},
		{
			icon: Award,
			title: "Best Price Guarantee",
			description: "We match any competitor price"
		}
	];
	// Cab placeholder images
	const CAB_IMAGES = [
		"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1533473359331-0135ef1b58af?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80"
	];
	// Static cabs data
	const cabs = [
		{
			id: 1,
			model: "Maruti Swift",
			type: "Economy",
			price: 1800,
			rating: 4.5,
			departure: "08:00",
			arrival: "12:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 2,
			model: "Toyota Etios",
			type: "Sedan",
			price: 2400,
			rating: 4.7,
			departure: "10:00",
			arrival: "14:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 3,
			model: "Mahindra Scorpio",
			type: "SUV",
			price: 3500,
			rating: 4.6,
			departure: "14:00",
			arrival: "18:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 4,
			model: "Honda City",
			type: "Premium",
			price: 3200,
			rating: 4.8,
			departure: "16:00",
			arrival: "20:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 5,
			model: "Toyota Innova",
			type: "SUV",
			price: 3800,
			rating: 4.7,
			departure: "18:00",
			arrival: "22:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58af?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 6,
			model: "Honda Amaze",
			type: "Economy",
			price: 1600,
			rating: 4.4,
			departure: "06:00",
			arrival: "10:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80"
		},
		{
			id: 7,
			model: "Mercedes E-Class",
			type: "Premium",
			price: 5500,
			rating: 4.9,
			departure: "09:00",
			arrival: "13:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 8,
			model: "Hyundai Verna",
			type: "Sedan",
			price: 2200,
			rating: 4.6,
			departure: "11:00",
			arrival: "15:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1556189250-72ba954cfc0b?auto=format&fit=crop&w=400&q=80"
		},
		{
			id: 9,
			model: "Mahindra XUV500",
			type: "SUV",
			price: 3200,
			rating: 4.5,
			departure: "13:00",
			arrival: "17:00",
			duration: "4h",
			image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80"
		}
	];
	// Filter state
	const [filters, setFilters] = useState({
		stops: [],
		departureTimes: [],
		minPrice: "",
		maxPrice: "",
		airlines: []
	});
	// Cab handlers (state already declared above)
	const handleCabCheckbox = (category, value) => {
		const current = cabFilters[category] || [];
		const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
		setCabFilters((prev) => ({
			...prev,
			[category]: updated
		}));
	};
	const handleCabPriceChange = (type, value) => {
		setCabFilters((prev) => ({
			...prev,
			[type]: value
		}));
	};
	const handleCabReset = () => {
		setCabFilters({
			cabTypes: [],
			minPrice: "",
			maxPrice: "",
			departureTimes: [],
			stops: []
		});
	};
	const getCabTimeBucket = (time) => {
		const hour = parseInt(time.split(":")[0]);
		if (hour >= 0 && hour < 6) return "earlyMorning";
		if (hour >= 6 && hour < 12) return "morning";
		if (hour >= 12 && hour < 16) return "afternoon";
		if (hour >= 16 && hour < 20) return "evening";
		return "night";
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
			case "price_low": return sorted.sort((a, b) => a.price - b.price);
			case "price_high": return sorted.sort((a, b) => b.price - a.price);
			case "rating": return sorted.sort((a, b) => b.rating - a.rating);
			default: return sorted;
		}
	}, [filteredCabs, cabSortBy]);
	const minCabPrice = filteredCabs.length > 0 ? Math.min(...filteredCabs.map((c) => c.price)) : null;
	// Cab booking handler
	const handleBookCab = (cab) => {
		handleBooking(navigate, "cab", cab, { passengers });
	};
	// Fetch data from API when search parameters change
	useEffect(() => {
		const fetchData = async () => {
			// Clear previous data
			setFlights([]);
			setTrains([]);
			setError(null);
			setLoading(true);
			if (type === "flights") {
				if (source && destination && source === destination) {
					setError("Source and destination cannot be the same. Please choose different cities.");
					setLoading(false);
					return;
				}
				if (source && destination) {
					try {
						const response = await axios.get(`http://localhost:5000/api/flights`, { params: {
							source: source.trim(),
							destination: destination.trim(),
							date: date || undefined
						} });
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
						setError("Failed to load featured flights. Please try again.");
					} finally {
						setLoading(false);
					}
				}
			} else if (type === "trains") {
				if (source && destination && source === destination) {
					setError("Source and destination cannot be the same. Please choose different cities.");
					setLoading(false);
					return;
				}
				try {
					const response = await axios.get(`http://localhost:5000/api/trains`, { params: {
						source: source.trim(),
						destination: destination.trim(),
						date: date || undefined
					} });
					setTrains(response.data);
					setIsShowcaseMode(!(source && destination));
				} catch (err) {
					const errorMsg = err.response?.data?.message || `Failed to fetch trains from ${source} to ${destination}. Please try again.`;
					setError(errorMsg);
				} finally {
					setLoading(false);
				}
			} else if (type === "cabs") {
				// Cabs data is static, no API fetch needed
				setLoading(false);
			}
			// Packages handled separately below
		};
		fetchData();
	}, [
		type,
		source,
		destination,
		date
	]);
	useEffect(() => {
		if (location.state?.bookingSuccess) {
			setBookingStatus({
				success: true,
				message: location.state.message || "Booking confirmed!"
			});
			setTimeout(() => {
				navigate(".", {
					replace: true,
					state: {}
				});
			}, 5e3);
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
				const [hour] = f.departureTime.split(":").map(Number);
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
				if (t.stops === "Non-stop") numericStop = 0;
				else if (t.stops === "1 Stop") numericStop = 1;
				else numericStop = 2;
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
				const [hour] = t.departure.split(":").map(Number);
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
		if (trainSortBy === "price") {
			sorted.sort((a, b) => a.price - b.price);
		} else if (trainSortBy === "price-high") {
			sorted.sort((a, b) => b.price - a.price);
		} else if (trainSortBy === "departure") {
			sorted.sort((a, b) => a.departure.localeCompare(b.departure));
		} else if (trainSortBy === "duration") {
			sorted.sort((a, b) => {
				const aDuration = parseInt(a.duration.replace("h", "").replace("m", "").split(" ")[0]) * 60 + parseInt(a.duration.match(/(\d+)m/)?.[1] || 0);
				const bDuration = parseInt(b.duration.replace("h", "").replace("m", "").split(" ")[0]) * 60 + parseInt(b.duration.match(/(\d+)m/)?.[1] || 0);
				return aDuration - bDuration;
			});
		} else if (trainSortBy === "recommended" || trainSortBy === "") {
			// Recommended: shortest duration first, then by price
			sorted.sort((a, b) => {
				const aDuration = parseInt(a.duration.replace("h", "").replace("m", "").split(" ")[0]) * 60 + parseInt(a.duration.match(/(\d+)m/)?.[1] || 0);
				const bDuration = parseInt(b.duration.replace("h", "").replace("m", "").split(" ")[0]) * 60 + parseInt(b.duration.match(/(\d+)m/)?.[1] || 0);
				if (aDuration !== bDuration) return aDuration - bDuration;
				return a.price - b.price;
			});
		}
		return sorted;
	}, [filteredTrains, trainSortBy]);
	const handleBook = (flight) => {
		if (!user) {
			alert("Please login to book a flight");
			navigate("/login");
			return;
		}
		handleBooking(navigate, "flight", flight, { passengers });
	};
	const handleViewDetails = (flight) => {
		const stopsText = flight.stops === 0 ? "Non-stop" : flight.stops === 1 ? "1 Stop" : `${flight.stops} Stops`;
		alert(`Flight ${flight.flightNumber}\nAirline: ${flight.airline}\nRoute: ${flight.source} → ${flight.destination}\nDeparture: ${flight.departureTime}\nArrival: ${flight.arrivalTime}\nDuration: ${flight.duration}\nStops: ${stopsText}\nPrice: ₹${flight.price.toLocaleString("en-IN")}`);
	};
	const handleBookTrain = (train) => {
		if (!user) {
			alert("Please login to book a train");
			navigate("/login");
			return;
		}
		// Navigate to checkout page with train data
		handleBooking(navigate, "train", train, { passengers });
	};
	const handleViewTrainDetails = (train) => {
		alert(`Train ${train.trainNumber}\nName: ${train.name}\nRoute: ${train.source} → ${train.destination}\nDeparture: ${train.departure}\nArrival: ${train.arrival}\nDuration: ${train.duration}\nStops: ${train.stops}\nClass: ${train.class}\nPrice: ₹${train.price.toLocaleString("en-IN")}`);
	};
	const handlePackageBook = (pkg) => {
		handleBooking(navigate, "package", pkg, { passengers });
	};
	// Helper functions (must be inside component to access state)
	const getRouteTitle = () => {
		if (isShowcaseMode) {
			return type === "trains" ? "Explore Popular Trains" : "Explore Popular Flights";
		}
		const src = source || "Delhi";
		const dest = destination || "Mumbai";
		return `${src} → ${dest}`;
	};
	const getSubtitle = () => {
		const count = type === "trains" ? filteredTrains.length : filteredFlights.length;
		const item = type === "trains" ? "train" : "flight";
		if (isShowcaseMode) {
			return `Discover our featured ${type === "trains" ? "trains" : "flights"} across India`;
		}
		return `${count} ${item}s available${source && destination && source !== destination && ` from ${source} to ${destination}`}`;
	};
	// Render Packages UI
	if (type === "packages") {
		return /* @__PURE__ */ _jsxDEV("div", {
			className: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/10 to-purple-50/10",
			children: [
				/* @__PURE__ */ _jsxDEV("svg", {
					className: "absolute bottom-0 left-0 w-full h-24 text-gray-50",
					viewBox: "0 0 1440 120",
					preserveAspectRatio: "none",
					children: /* @__PURE__ */ _jsxDEV("path", {
						fill: "currentColor",
						d: "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 810,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 809,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("section", {
					className: "relative h-[40vh] overflow-hidden",
					children: [
						/* @__PURE__ */ _jsxDEV("img", {
							src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=100",
							alt: "Travel Hero",
							className: "absolute w-full h-full object-cover scale-105 blur-[2px]"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 815,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { className: "absolute inset-0 bg-white/70" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 820,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { className: "absolute bottom-0 left-0 right-0 h-12 bg-white" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 821,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4",
							children: [/* @__PURE__ */ _jsxDEV("h1", {
								className: "text-4xl md:text-5xl font-bold drop-shadow-md",
								children: "Explore Dream Packages"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 824,
								columnNumber: 13
							}, this), /* @__PURE__ */ _jsxDEV("p", {
								className: "mt-2 text-base md:text-lg text-white/90",
								children: "Discover handpicked travel experiences crafted just for you"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 827,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 823,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 814,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("section", {
					className: "py-16 px-4 bg-white relative overflow-hidden",
					children: /* @__PURE__ */ _jsxDEV("div", {
						className: "max-w-7xl mx-auto",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "text-center mb-12",
							children: [/* @__PURE__ */ _jsxDEV("h2", {
								className: "text-4xl font-bold text-gray-900 mb-3",
								children: "Best Offers"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 838,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("p", {
								className: "text-lg text-gray-600",
								children: "Exclusive deals you won't find elsewhere"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 839,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 837,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
							children: domesticPackages.map((pkg) => /* @__PURE__ */ _jsxDEV("div", {
								className: "group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-blue-100",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "relative h-56 overflow-hidden",
									children: [/* @__PURE__ */ _jsxDEV("img", {
										src: pkg.image,
										alt: pkg.title,
										className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
										onError: (e) => {
											e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 849,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 857,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 848,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									className: "p-5",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center justify-between mb-2",
											children: [/* @__PURE__ */ _jsxDEV("span", {
												className: "text-xs font-semibold text-blue-600 uppercase tracking-wide",
												children: pkg.type
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 862,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("div", {
												className: "flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full",
												children: [
													/* @__PURE__ */ _jsxDEV(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 864,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ _jsxDEV("span", {
														className: "text-xs font-bold text-gray-900",
														children: pkg.rating
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 865,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ _jsxDEV("span", {
														className: "text-xs text-gray-400",
														children: [
															"(",
															pkg.reviews,
															")"
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 866,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 863,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 861,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("h3", {
											className: "font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors",
											children: pkg.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 870,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center space-x-1 text-sm text-gray-500 mb-2",
											children: [/* @__PURE__ */ _jsxDEV(MapPin, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 875,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: pkg.location }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 876,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 874,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center space-x-1 text-sm text-gray-400 mb-4",
											children: [/* @__PURE__ */ _jsxDEV(Clock, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 880,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: pkg.duration }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 881,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 879,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center justify-between pt-3 border-t border-gray-100",
											children: [/* @__PURE__ */ _jsxDEV("div", { children: [
												/* @__PURE__ */ _jsxDEV("p", {
													className: "text-xs text-gray-400 line-through",
													children: ["₹", pkg.originalPrice.toLocaleString()]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 886,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ _jsxDEV("div", {
													className: "flex items-baseline space-x-1",
													children: [/* @__PURE__ */ _jsxDEV(IndianRupee, { className: "h-4 w-4 text-blue-600" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 888,
														columnNumber: 27
													}, this), /* @__PURE__ */ _jsxDEV("span", {
														className: "text-2xl font-bold text-blue-600",
														children: pkg.price.toLocaleString()
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 889,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 887,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ _jsxDEV("p", {
													className: "text-xs text-gray-400",
													children: "per person"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 891,
													columnNumber: 25
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 885,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("button", {
												onClick: () => handlePackageBook(pkg),
												className: "px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2",
												children: [/* @__PURE__ */ _jsxDEV("span", { children: "Book Now" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 897,
													columnNumber: 25
												}, this), /* @__PURE__ */ _jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 898,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 893,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 884,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 860,
									columnNumber: 19
								}, this)]
							}, pkg.id, true, {
								fileName: _jsxFileName,
								lineNumber: 844,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 842,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 836,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 835,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("section", {
					className: "py-20 px-4 bg-gray-50",
					children: /* @__PURE__ */ _jsxDEV("div", {
						className: "max-w-7xl mx-auto",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "text-center mb-12",
							children: [/* @__PURE__ */ _jsxDEV("h2", {
								className: "text-4xl font-bold text-gray-900 mb-3",
								children: "All Packages"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 912,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("p", {
								className: "text-lg text-gray-600",
								children: "Curated experiences for every type of traveler"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 913,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 911,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
							children: packages.map((pkg) => /* @__PURE__ */ _jsxDEV("div", {
								className: "group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "relative h-52 overflow-hidden",
									children: [
										/* @__PURE__ */ _jsxDEV("img", {
											src: pkg.image,
											alt: pkg.title,
											className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
											onError: (e) => {
												e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 923,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md",
											children: pkg.type
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 931,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center space-x-1",
											children: [/* @__PURE__ */ _jsxDEV(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 935,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: pkg.rating }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 936,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 934,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 922,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									className: "p-5",
									children: [
										/* @__PURE__ */ _jsxDEV("h3", {
											className: "font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight",
											children: pkg.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 941,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center space-x-1 text-sm text-gray-500 mb-1",
											children: [/* @__PURE__ */ _jsxDEV(MapPin, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 946,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: pkg.location }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 947,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 945,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center space-x-1 text-sm text-gray-400 mb-3",
											children: [/* @__PURE__ */ _jsxDEV(Clock, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 951,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: pkg.duration }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 952,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 950,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex flex-wrap gap-2 mb-4",
											children: pkg.highlights.slice(0, 3).map((highlight, idx) => /* @__PURE__ */ _jsxDEV("span", {
												className: "px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-md font-medium",
												children: highlight
											}, idx, false, {
												fileName: _jsxFileName,
												lineNumber: 957,
												columnNumber: 25
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 955,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center justify-between pt-3 border-t border-gray-100",
											children: [/* @__PURE__ */ _jsxDEV("div", { children: [
												/* @__PURE__ */ _jsxDEV("p", {
													className: "text-xs text-gray-400 line-through",
													children: ["₹", pkg.originalPrice.toLocaleString()]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 968,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ _jsxDEV("div", {
													className: "flex items-baseline space-x-1",
													children: [/* @__PURE__ */ _jsxDEV(IndianRupee, { className: "h-4 w-4 text-gray-400" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 970,
														columnNumber: 27
													}, this), /* @__PURE__ */ _jsxDEV("span", {
														className: "text-xl font-bold text-gray-900",
														children: pkg.price.toLocaleString()
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 971,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 969,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ _jsxDEV("p", {
													className: "text-xs text-gray-400",
													children: "per person"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 973,
													columnNumber: 25
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 967,
												columnNumber: 23
											}, this), /* @__PURE__ */ _jsxDEV("button", {
												onClick: () => handlePackageBook(pkg),
												className: "px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2",
												children: [/* @__PURE__ */ _jsxDEV("span", { children: "Book Now" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 979,
													columnNumber: 25
												}, this), /* @__PURE__ */ _jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 980,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 975,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 966,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 940,
									columnNumber: 19
								}, this)]
							}, pkg.id, true, {
								fileName: _jsxFileName,
								lineNumber: 918,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 916,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 910,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 909,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("section", {
					className: "py-20 px-4 bg-white relative overflow-hidden",
					children: [
						/* @__PURE__ */ _jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 992,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { className: "absolute top-20 left-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 993,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { className: "absolute bottom-20 right-10 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 994,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "max-w-7xl mx-auto relative z-10",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "text-center mb-16",
								children: [/* @__PURE__ */ _jsxDEV("h2", {
									className: "text-4xl font-bold text-gray-900 mb-3",
									children: "Why Choose TravelBuddy?"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 998,
									columnNumber: 15
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									className: "text-lg text-gray-600 max-w-3xl mx-auto",
									children: "We go above and beyond to make your travel dreams come true with premium services and unforgettable experiences"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 999,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 997,
								columnNumber: 13
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
								children: features.map((feature, index) => /* @__PURE__ */ _jsxDEV("div", {
									className: "group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
											children: /* @__PURE__ */ _jsxDEV(feature.icon, { className: "h-8 w-8 text-white" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1011,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1010,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ _jsxDEV("h3", {
											className: "text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors",
											children: feature.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1014,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ _jsxDEV("p", {
											className: "text-gray-600 leading-relaxed",
											children: feature.description
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1017,
											columnNumber: 19
										}, this)
									]
								}, index, true, {
									fileName: _jsxFileName,
									lineNumber: 1006,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1004,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 996,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 991,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "absolute bottom-0 left-0 right-0",
					children: /* @__PURE__ */ _jsxDEV("svg", {
						className: "w-full h-24",
						viewBox: "0 0 1440 120",
						preserveAspectRatio: "none",
						children: /* @__PURE__ */ _jsxDEV("path", {
							fill: "currentColor",
							fillOpacity: "1",
							className: "text-gray-50",
							d: "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1028,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1027,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1026,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 807,
			columnNumber: 7
		}, this);
	}
	;
	// Not supported types
	if (type !== "flights" && type !== "trains" && type !== "cabs") {
		return /* @__PURE__ */ _jsxDEV("div", {
			className: "min-h-screen bg-gray-50",
			children: [/* @__PURE__ */ _jsxDEV(TopSearchBar, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1039,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "max-w-7xl mx-auto px-4 py-20 text-center",
				children: [/* @__PURE__ */ _jsxDEV("h1", {
					className: "text-2xl font-bold text-gray-900 capitalize",
					children: [type, " Search"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1041,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("p", {
					className: "text-gray-600 mt-2",
					children: "This service type is not yet supported."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1042,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1040,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1038,
			columnNumber: 7
		}, this);
	}
	// Main results page (Google Flights layout)
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "min-h-screen bg-gray-50",
		children: [
			/* @__PURE__ */ _jsxDEV(TopSearchBar, { initialValues: {
				source,
				destination,
				date,
				returnDate: returnDateParam,
				class: travelClass,
				passengers
			} }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1052,
				columnNumber: 7
			}, this),
			bookingStatus && /* @__PURE__ */ _jsxDEV("div", {
				className: `max-w-7xl mx-auto px-4 mt-2 ${bookingStatus.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg p-2 flex items-center gap-2 text-sm`,
				children: [bookingStatus.success ? /* @__PURE__ */ _jsxDEV(CheckCircle, { className: "h-4 w-4 text-green-600" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1067,
					columnNumber: 13
				}, this) : /* @__PURE__ */ _jsxDEV(XCircle, { className: "h-4 w-4 text-red-600" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1068,
					columnNumber: 13
				}, this), /* @__PURE__ */ _jsxDEV("span", {
					className: bookingStatus.success ? "text-green-800" : "text-red-800",
					children: bookingStatus.message
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1070,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1065,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "max-w-7xl mx-auto px-4",
				children: [
					error && /* @__PURE__ */ _jsxDEV("div", {
						className: "mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ _jsxDEV(XCircle, { className: "h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1080,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							className: "text-red-800",
							children: error
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1081,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1079,
						columnNumber: 11
					}, this),
					!error && source && destination && source === destination && /* @__PURE__ */ _jsxDEV("div", {
						className: "mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ _jsxDEV(XCircle, { className: "h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1087,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							className: "text-amber-800",
							children: "Source and destination cannot be the same."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1088,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1086,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV(FilterBar, {
						flights: filteredFlights,
						activeFilters: {},
						onFilterChange: () => {}
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1093,
						columnNumber: 9
					}, this),
					type === "flights" && /* @__PURE__ */ _jsxDEV(SortBar, {
						flights: filteredFlights,
						currentSort: flightSortBy,
						onSortChange: setFlightSortBy
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1101,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "mt-3 mb-4",
						children: /* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "p-1.5 bg-blue-100 rounded-md",
									children: type === "trains" ? /* @__PURE__ */ _jsxDEV(Train, { className: "h-5 w-5 text-blue-600" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1113,
										columnNumber: 17
									}, this) : /* @__PURE__ */ _jsxDEV(Plane, { className: "h-5 w-5 text-blue-600" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1114,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1111,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h1", {
									className: "text-lg font-bold text-gray-900",
									children: type === "flights" || type === "trains" ? getRouteTitle() : ""
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1118,
									columnNumber: 15
								}, this), /* @__PURE__ */ _jsxDEV("p", {
									className: "text-xs text-gray-600",
									children: [
										type === "trains" ? filteredTrains.length : filteredFlights.length,
										" ",
										" ",
										type === "trains" ? filteredTrains.length === 1 ? "train" : "trains" : filteredFlights.length === 1 ? "flight" : "flights",
										" found"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1121,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1117,
									columnNumber: 13
								}, this),
								type !== "flights" && /* @__PURE__ */ _jsxDEV("button", {
									onClick: () => setIsFilterDrawerOpen(true),
									className: "lg:hidden ml-auto flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50",
									children: [/* @__PURE__ */ _jsxDEV(Filter, { className: "w-4 h-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1132,
										columnNumber: 17
									}, this), "Filters"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1128,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1110,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1109,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("main", { children: type === "flights" ? /* @__PURE__ */ _jsxDEV(FlightList, {
						flights: filteredFlights,
						sortBy: flightSortBy,
						onSortChange: setFlightSortBy,
						onBook: handleBook,
						onViewDetails: handleViewDetails,
						loading
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1142,
						columnNumber: 13
					}, this) : type === "trains" ? /* @__PURE__ */ _jsxDEV(
						"div",
						// Train results (keep existing UI with its own sort dropdown)
						{ children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ _jsxDEV("p", {
								className: "text-sm text-gray-600",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "font-semibold text-gray-900",
									children: sortedTrains.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1155,
									columnNumber: 19
								}, this), " trains available"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1154,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ _jsxDEV("label", {
									className: "text-sm text-gray-600",
									children: "Sort by:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1158,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("select", {
									value: trainSortBy,
									onChange: (e) => setTrainSortBy(e.target.value),
									className: "text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
									children: [
										/* @__PURE__ */ _jsxDEV("option", {
											value: "recommended",
											children: "Recommended"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1164,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "price",
											children: "Price: Low to High"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1165,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "price-high",
											children: "Price: High to Low"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1166,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "departure",
											children: "Departure"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1167,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "duration",
											children: "Duration"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1168,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1159,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1157,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1153,
							columnNumber: 15
						}, this), loading ? /* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center justify-center py-20",
							children: /* @__PURE__ */ _jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1175,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1174,
							columnNumber: 17
						}, this) : sortedTrains.length === 0 ? /* @__PURE__ */ _jsxDEV("div", {
							className: "bg-white rounded-lg border border-gray-200 p-12 text-center",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",
									children: /* @__PURE__ */ _jsxDEV(Train, { className: "h-8 w-8 text-gray-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1180,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1179,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ _jsxDEV("h3", {
									className: "text-lg font-semibold text-gray-900 mb-2",
									children: "No trains found"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1182,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ _jsxDEV("p", {
									className: "text-sm text-gray-600 mb-4",
									children: "Try adjusting your search or filters"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1183,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1178,
							columnNumber: 17
						}, this) : /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-3",
							children: sortedTrains.map((train) => /* @__PURE__ */ _jsxDEV("div", {
								className: "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col lg:flex-row items-start lg:items-center gap-4",
								children: [
									/* @__PURE__ */ _jsxDEV("div", {
										className: "flex items-center gap-3 w-full lg:w-auto lg:min-w-[180px]",
										children: [/* @__PURE__ */ _jsxDEV("div", {
											className: "w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0",
											children: /* @__PURE__ */ _jsxDEV(Train, { className: "h-5 w-5 text-white" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1195,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1194,
											columnNumber: 25
										}, this), /* @__PURE__ */ _jsxDEV("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "text-sm font-semibold text-gray-900 truncate",
												children: train.name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1198,
												columnNumber: 27
											}, this), /* @__PURE__ */ _jsxDEV("div", {
												className: "text-xs text-gray-500",
												children: train.trainNumber
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1199,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1197,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1193,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 w-full",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "text-center sm:text-left min-w-[60px]",
												children: [/* @__PURE__ */ _jsxDEV("div", {
													className: "text-lg font-bold text-gray-900",
													children: train.departure
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1205,
													columnNumber: 27
												}, this), /* @__PURE__ */ _jsxDEV("div", {
													className: "text-sm text-gray-600 font-medium truncate",
													children: train.source
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1206,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1204,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "flex flex-col items-center gap-1 flex-shrink-0",
												children: [
													/* @__PURE__ */ _jsxDEV("div", {
														className: "text-xs text-gray-500",
														children: train.duration
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1210,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ _jsxDEV("div", {
														className: "relative w-20 sm:w-28 h-px bg-gray-300",
														children: /* @__PURE__ */ _jsxDEV("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-300 rounded-full" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1212,
															columnNumber: 29
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1211,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ _jsxDEV("div", {
														className: "text-xs text-gray-600 font-medium",
														children: train.stops
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1214,
														columnNumber: 27
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1209,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "text-center sm:text-left min-w-[60px]",
												children: [/* @__PURE__ */ _jsxDEV("div", {
													className: "text-lg font-bold text-gray-900",
													children: train.arrival
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1220,
													columnNumber: 27
												}, this), /* @__PURE__ */ _jsxDEV("div", {
													className: "text-sm text-gray-600 font-medium truncate",
													children: train.destination
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1221,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1219,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1203,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "flex items-center justify-between w-full lg:w-auto gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-4 mt-1",
										children: [/* @__PURE__ */ _jsxDEV("div", {
											className: "flex-shrink-0",
											children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "text-xl font-extrabold text-gray-900",
												children: ["₹", train.price.toLocaleString("en-IN")]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1227,
												columnNumber: 27
											}, this), /* @__PURE__ */ _jsxDEV("div", {
												className: "text-xs text-gray-500",
												children: "per person"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1228,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1226,
											columnNumber: 25
										}, this), /* @__PURE__ */ _jsxDEV("button", {
											onClick: () => handleBookTrain(train),
											className: "flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2 text-sm font-semibold rounded shadow-sm hover:shadow transition-all",
											children: "Book Now"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1230,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1225,
										columnNumber: 23
									}, this)
								]
							}, train._id, true, {
								fileName: _jsxFileName,
								lineNumber: 1188,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1186,
							columnNumber: 17
						}, this)] },
						void 0,
						true,
						{
							fileName: _jsxFileName,
							lineNumber: 1152,
							columnNumber: 13
						},
						this
					) : type === "cabs" ? /* @__PURE__ */ _jsxDEV(
						"div",
						// Cabs results (keep existing)
						{ children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ _jsxDEV("p", {
								className: "text-sm text-gray-600",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "font-semibold text-gray-900",
									children: sortedCabs.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1247,
									columnNumber: 19
								}, this), " cabs available"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1246,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ _jsxDEV("label", {
									className: "text-sm text-gray-600",
									children: "Sort by:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1250,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("select", {
									value: cabSortBy,
									onChange: (e) => setCabSortBy(e.target.value),
									className: "text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
									children: [
										/* @__PURE__ */ _jsxDEV("option", {
											value: "recommended",
											children: "Recommended"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1256,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "price_low",
											children: "Price: Low to High"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1257,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "price_high",
											children: "Price: High to Low"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1258,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ _jsxDEV("option", {
											value: "rating",
											children: "Highest Rated"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1259,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1251,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1249,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1245,
							columnNumber: 15
						}, this), sortedCabs.length > 0 ? /* @__PURE__ */ _jsxDEV("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
							children: sortedCabs.map((cab, idx) => /* @__PURE__ */ _jsxDEV("div", {
								className: "group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "relative h-40 overflow-hidden rounded-t-xl",
									children: [
										/* @__PURE__ */ _jsxDEV("img", {
											src: cab.image || CAB_IMAGES[idx % CAB_IMAGES.length],
											alt: cab.model,
											className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
											onError: (e) => {
												e.target.onerror = null;
												e.target.src = CAB_IMAGES[0];
											}
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1272,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold",
											children: cab.type
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1281,
											columnNumber: 25
										}, this),
										cab.rating >= 4.5 && /* @__PURE__ */ _jsxDEV("div", {
											className: "absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-gray-900 flex items-center space-x-1",
											children: [/* @__PURE__ */ _jsxDEV(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1286,
												columnNumber: 29
											}, this), /* @__PURE__ */ _jsxDEV("span", { children: cab.rating }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1287,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1285,
											columnNumber: 27
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1271,
									columnNumber: 23
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									className: "p-4",
									children: [
										/* @__PURE__ */ _jsxDEV("h3", {
											className: "font-bold text-gray-900 text-sm leading-tight mb-1",
											children: [
												cab.type,
												" Ride - ",
												cab.model
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1293,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ _jsxDEV("p", {
											className: "text-xs text-gray-500 mb-3 line-clamp-2",
											children: [
												source || "Pickup",
												" → ",
												destination || "Drop",
												" • ",
												cab.duration,
												" • ",
												cab.departure,
												" - ",
												cab.arrival
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1296,
											columnNumber: 25
										}, this),
										cab.price === minCabPrice && /* @__PURE__ */ _jsxDEV("div", {
											className: "mb-2",
											children: /* @__PURE__ */ _jsxDEV("span", {
												className: "inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded",
												children: "Best Price"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1301,
												columnNumber: 29
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1300,
											columnNumber: 27
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "flex items-center justify-between pt-3 border-t border-gray-100",
											children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "flex items-center space-x-1",
												children: [/* @__PURE__ */ _jsxDEV(IndianRupee, { className: "h-4 w-4 text-gray-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1309,
													columnNumber: 31
												}, this), /* @__PURE__ */ _jsxDEV("span", {
													className: "text-lg font-bold text-gray-900",
													children: cab.price.toLocaleString()
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1310,
													columnNumber: 31
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1308,
												columnNumber: 29
											}, this), /* @__PURE__ */ _jsxDEV("p", {
												className: "text-[10px] text-gray-400",
												children: "one-way fare"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1312,
												columnNumber: 29
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1307,
												columnNumber: 27
											}, this), /* @__PURE__ */ _jsxDEV("button", {
												onClick: () => handleBookCab(cab),
												className: "px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded shadow-sm hover:shadow transition-all",
												children: "BOOK NOW"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1314,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1306,
											columnNumber: 25
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1292,
									columnNumber: 23
								}, this)]
							}, cab.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1267,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1265,
							columnNumber: 17
						}, this) : /* @__PURE__ */ _jsxDEV("div", {
							className: "bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center",
							children: /* @__PURE__ */ _jsxDEV("p", {
								className: "text-gray-500",
								children: "No cabs match your filters. Try adjusting them."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1327,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1326,
							columnNumber: 17
						}, this)] },
						void 0,
						true,
						{
							fileName: _jsxFileName,
							lineNumber: 1244,
							columnNumber: 13
						},
						this
					) : null }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1140,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1076,
				columnNumber: 7
			}, this),
			isFilterDrawerOpen && /* @__PURE__ */ _jsxDEV("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "absolute inset-0 bg-black/50",
					onClick: () => setIsFilterDrawerOpen(false)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1338,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col",
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center justify-between p-4 border-b",
							children: [/* @__PURE__ */ _jsxDEV("h2", {
								className: "text-lg font-semibold text-gray-900",
								children: "Filters"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1341,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => setIsFilterDrawerOpen(false),
								className: "p-2 text-gray-500 hover:text-gray-700",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1342,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1340,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex-1 overflow-y-auto p-4",
							children: type === "cabs" ? /* @__PURE__ */ _jsxDEV("div", { children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex items-center justify-between mb-4",
									children: [/* @__PURE__ */ _jsxDEV("h2", {
										className: "text-base font-semibold text-gray-900",
										children: "Filters"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1350,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("button", {
										onClick: handleCabReset,
										className: "text-xs text-blue-600 hover:text-blue-700 font-medium",
										children: "Clear All"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1351,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1349,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "mb-5",
									children: [/* @__PURE__ */ _jsxDEV("h3", {
										className: "text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5",
										children: "Cab Types"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1356,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "space-y-2",
										children: [
											"Economy",
											"Sedan",
											"SUV",
											"Premium",
											"Airport Transfer",
											"Outstation"
										].map((type) => /* @__PURE__ */ _jsxDEV("label", {
											className: "flex items-center cursor-pointer group",
											children: [/* @__PURE__ */ _jsxDEV("input", {
												type: "checkbox",
												checked: cabFilters.cabTypes?.includes(type) || false,
												onChange: () => handleCabCheckbox("cabTypes", type),
												className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1360,
												columnNumber: 27
											}, this), /* @__PURE__ */ _jsxDEV("span", {
												className: "ml-2 text-sm text-gray-700 group-hover:text-blue-600",
												children: type
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1366,
												columnNumber: 27
											}, this)]
										}, type, true, {
											fileName: _jsxFileName,
											lineNumber: 1359,
											columnNumber: 25
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1357,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1355,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "mb-5",
									children: [/* @__PURE__ */ _jsxDEV("h3", {
										className: "text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5",
										children: "Departure Time"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1372,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "space-y-2",
										children: [
											{
												id: "earlyMorning",
												label: "Early Morning"
											},
											{
												id: "morning",
												label: "Morning"
											},
											{
												id: "afternoon",
												label: "Afternoon"
											},
											{
												id: "evening",
												label: "Evening"
											},
											{
												id: "night",
												label: "Night"
											}
										].map((time) => /* @__PURE__ */ _jsxDEV("label", {
											className: "flex items-center cursor-pointer group",
											children: [/* @__PURE__ */ _jsxDEV("input", {
												type: "checkbox",
												checked: cabFilters.departureTimes?.includes(time.id) || false,
												onChange: () => handleCabCheckbox("departureTimes", time.id),
												className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1382,
												columnNumber: 27
											}, this), /* @__PURE__ */ _jsxDEV("span", {
												className: "ml-2 text-sm text-gray-700 group-hover:text-blue-600",
												children: time.label
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1388,
												columnNumber: 27
											}, this)]
										}, time.id, true, {
											fileName: _jsxFileName,
											lineNumber: 1381,
											columnNumber: 25
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1373,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1371,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "mb-5",
									children: [/* @__PURE__ */ _jsxDEV("h3", {
										className: "text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5",
										children: "Price Range"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1394,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "flex-1",
												children: /* @__PURE__ */ _jsxDEV("input", {
													type: "number",
													placeholder: "Min",
													value: cabFilters.minPrice,
													onChange: (e) => handleCabPriceChange("minPrice", e.target.value),
													className: "w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1397,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1396,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-gray-400 text-sm",
												children: "-"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1405,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "flex-1",
												children: /* @__PURE__ */ _jsxDEV("input", {
													type: "number",
													placeholder: "Max",
													value: cabFilters.maxPrice,
													onChange: (e) => handleCabPriceChange("maxPrice", e.target.value),
													className: "w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1407,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1406,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1395,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1393,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "mb-5",
									children: [/* @__PURE__ */ _jsxDEV("h3", {
										className: "text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5",
										children: "Stops"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1418,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "space-y-2",
										children: [
											"Non-stop",
											"1 Stop",
											"2+ Stops"
										].map((stop) => /* @__PURE__ */ _jsxDEV("label", {
											className: "flex items-center cursor-pointer group",
											children: [/* @__PURE__ */ _jsxDEV("input", {
												type: "checkbox",
												checked: cabFilters.stops?.includes(stop) || false,
												onChange: () => handleCabCheckbox("stops", stop),
												className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1422,
												columnNumber: 27
											}, this), /* @__PURE__ */ _jsxDEV("span", {
												className: "ml-2 text-sm text-gray-700 group-hover:text-blue-600",
												children: stop
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1428,
												columnNumber: 27
											}, this)]
										}, stop, true, {
											fileName: _jsxFileName,
											lineNumber: 1421,
											columnNumber: 25
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1419,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1417,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1348,
								columnNumber: 17
							}, this) : /* @__PURE__ */ _jsxDEV(Filters, {
								filters,
								onFilterChange: (category, value) => setFilters((prev) => ({
									...prev,
									[category]: value
								})),
								availableAirlines: type === "trains" ? TRAIN_TYPES : [
									"Indigo",
									"Air India",
									"SpiceJet",
									"Vistara",
									"Go First",
									"Akasa Air",
									"AirAsia"
								],
								serviceType: type
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1435,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1346,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "p-4 border-t",
							children: /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => setIsFilterDrawerOpen(false),
								className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium",
								children: "Apply Filters"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1444,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1443,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1339,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1337,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1050,
		columnNumber: 5
	}, this);
};
_s(SearchResults, "k7nd1LpXOKzaY6pI6wT2ZzQ933Y=", false, function() {
	return [
		useParams,
		useSearchParams,
		useNavigate,
		useLocation
	];
});
_c = SearchResults;
export default SearchResults;
var _c;
$RefreshReg$(_c, "SearchResults");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/SearchResults.jsx?t=1775400967008173000";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/aksha/Downloads/Travel Booking System/travelbuddy-frontend/src/pages/SearchResults.jsx?t=1775400967008173000", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/aksha/Downloads/Travel Booking System/travelbuddy-frontend/src/pages/SearchResults.jsx?t=1775400967008173000", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "C:/Users/aksha/Downloads/Travel Booking System/travelbuddy-frontend/src/pages/SearchResults.jsx?t=1775400967008173000" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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UUFDM0YsbUJBQW1CLFNBQVMsV0FBVyxjQUFjO1NBQUM7U0FBVTtTQUFhO1NBQVk7U0FBVztTQUFZO1NBQWE7U0FBVTtRQUN2SSxhQUFhO1FBQ2I7Ozs7O09BRUE7Ozs7O01BQ04sd0JBQUMsT0FBRDtPQUFLLFdBQVU7aUJBQ2Isd0JBQUMsVUFBRDtRQUNFLGVBQWUsc0JBQXNCLE1BQU07UUFDM0MsV0FBVTtrQkFDWDtRQUVROzs7OztPQUNMOzs7OztNQUNGOzs7OzthQUNGOzs7Ozs7R0FFSjs7Ozs7Ozs7Ozs7Ozs7OztBQUlWLGVBQWUiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiU2VhcmNoUmVzdWx0cy5qc3g/dD0xNzc1NDAwOTY3MDA4MTczMDAwIl0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlLCB1c2VNZW1vLCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUGFyYW1zLCB1c2VTZWFyY2hQYXJhbXMsIHVzZU5hdmlnYXRlLCB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7XG4gIFBsYW5lLCBUcmFpbiwgQ2hlY2tDaXJjbGUsIFhDaXJjbGUsIE1hcFBpbiwgQ2xvY2ssIEluZGlhblJ1cGVlLFxuICBTdGFyLCBBcnJvd1JpZ2h0LCBGaWx0ZXJcbn0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCBUb3BTZWFyY2hCYXIgZnJvbSAnLi4vY29tcG9uZW50cy9Ub3BTZWFyY2hCYXInO1xuaW1wb3J0IEZpbHRlckJhciBmcm9tICcuLi9jb21wb25lbnRzL0ZpbHRlckJhcic7XG5pbXBvcnQgU29ydEJhciBmcm9tICcuLi9jb21wb25lbnRzL1NvcnRCYXInO1xuaW1wb3J0IEZsaWdodExpc3QgZnJvbSAnLi4vY29tcG9uZW50cy9GbGlnaHRMaXN0JztcbmltcG9ydCBGaWx0ZXJzIGZyb20gJy4uL2NvbXBvbmVudHMvRmlsdGVycyc7XG5pbXBvcnQgeyBBdXRoQ29udGV4dCB9IGZyb20gJy4uL2NvbnRleHQvQXV0aENvbnRleHQnO1xuaW1wb3J0IHsgaGFuZGxlQm9va2luZyB9IGZyb20gJy4uL3V0aWxzL2hhbmRsZUJvb2tpbmcnO1xuXG4vLyBUcmFpbi1zcGVjaWZpYyBjb25zdGFudHNcbmNvbnN0IFRSQUlOX1RZUEVTID0gWydFeHByZXNzJywgJ1N1cGVyZmFzdCcsICdSYWpkaGFuaScsICdTaGF0YWJkaScsICdHYXJpYiBSYXRoJywgJ0phbiBTaGF0YWJkaScsICdEdXJvbnRvJywgJ0h1bXNhZmFyJ107XG5cbmNvbnN0IFRJTUVfQlVDS0VUX1JBTkdFUyA9IHtcbiAgZWFybHlNb3JuaW5nOiB7IHN0YXJ0OiAwLCBlbmQ6IDYgfSxcbiAgbW9ybmluZzogeyBzdGFydDogNiwgZW5kOiAxMiB9LFxuICBtaWREYXk6IHsgc3RhcnQ6IDEyLCBlbmQ6IDE2IH0sXG4gIGV2ZW5pbmc6IHsgc3RhcnQ6IDE2LCBlbmQ6IDIwIH0sXG4gIG5pZ2h0OiB7IHN0YXJ0OiAyMCwgZW5kOiAyNCB9LFxufTtcblxuY29uc3QgU2VhcmNoUmVzdWx0cyA9ICgpID0+IHtcbiAgY29uc3QgeyB0eXBlIH0gPSB1c2VQYXJhbXMoKTtcbiAgY29uc3QgW3NlYXJjaFBhcmFtc10gPSB1c2VTZWFyY2hQYXJhbXMoKTtcbiAgY29uc3QgbmF2aWdhdGUgPSB1c2VOYXZpZ2F0ZSgpO1xuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG4gIGNvbnN0IHsgdXNlciB9ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XG5cbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbaXNGaWx0ZXJEcmF3ZXJPcGVuLCBzZXRJc0ZpbHRlckRyYXdlck9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZmxpZ2h0cywgc2V0RmxpZ2h0c10gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFt0cmFpbnMsIHNldFRyYWluc10gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFtpc1Nob3djYXNlTW9kZSwgc2V0SXNTaG93Y2FzZU1vZGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZmxpZ2h0U29ydEJ5LCBzZXRGbGlnaHRTb3J0QnldID0gdXNlU3RhdGUoJ2Jlc3QnKTtcbiAgY29uc3QgW3RyYWluU29ydEJ5LCBzZXRUcmFpblNvcnRCeV0gPSB1c2VTdGF0ZSgncmVjb21tZW5kZWQnKTtcbiAgY29uc3QgW2Jvb2tpbmdTdGF0dXMsIHNldEJvb2tpbmdTdGF0dXNdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgLy8gQ2FiLXNwZWNpZmljIHN0YXRlXG4gIGNvbnN0IFtjYWJGaWx0ZXJzLCBzZXRDYWJGaWx0ZXJzXSA9IHVzZVN0YXRlKHtcbiAgICBjYWJUeXBlczogW10sXG4gICAgbWluUHJpY2U6ICcnLFxuICAgIG1heFByaWNlOiAnJyxcbiAgICBkZXBhcnR1cmVUaW1lczogW10sXG4gICAgc3RvcHM6IFtdLFxuICB9KTtcbiAgY29uc3QgW2NhYlNvcnRCeSwgc2V0Q2FiU29ydEJ5XSA9IHVzZVN0YXRlKCdyZWNvbW1lbmRlZCcpO1xuXG4gIC8vIEdldCBxdWVyeSBwYXJhbWV0ZXJzXG4gIGNvbnN0IHNvdXJjZSA9IHNlYXJjaFBhcmFtcy5nZXQoJ3NvdXJjZScpPy50cmltKCkgfHwgJyc7XG4gIGNvbnN0IGRlc3RpbmF0aW9uID0gc2VhcmNoUGFyYW1zLmdldCgnZGVzdGluYXRpb24nKT8udHJpbSgpIHx8ICcnO1xuICBjb25zdCBkYXRlID0gc2VhcmNoUGFyYW1zLmdldCgnZGF0ZScpIHx8ICcnO1xuICBjb25zdCByZXR1cm5EYXRlUGFyYW0gPSBzZWFyY2hQYXJhbXMuZ2V0KCdyZXR1cm5EYXRlJykgfHwgJyc7XG4gIGNvbnN0IHBhc3NlbmdlcnMgPSBwYXJzZUludChzZWFyY2hQYXJhbXMuZ2V0KCdwYXNzZW5nZXJzJykpIHx8IDE7XG4gIGNvbnN0IHRyYXZlbENsYXNzID0gc2VhcmNoUGFyYW1zLmdldCgnY2xhc3MnKSB8fCAnRWNvbm9teSc7XG4gIC8vIEFsaWFzZXMgZm9yIGNvbnNpc3RlbmN5IChzb21lIHBhcnRzIG1heSB1c2Ugc2VhcmNoRnJvbS9zZWFyY2hUbylcbiAgY29uc3Qgc2VhcmNoRnJvbSA9IHNvdXJjZTtcbiAgY29uc3Qgc2VhcmNoVG8gPSBkZXN0aW5hdGlvbjtcblxuICAvLyBQYWNrYWdlcyBkYXRhIGZvciBwYWNrYWdlcyB0eXBlXG4gIGNvbnN0IG5ld1BhY2thZ2VzID0gW1xuICAgIHtcbiAgICAgIGlkOiAxMDEsXG4gICAgICB0aXRsZTogXCJQYXJpcyBSb21hbnRpYyBFc2NhcGVcIixcbiAgICAgIGxvY2F0aW9uOiBcIkZyYW5jZVwiLFxuICAgICAgaW1hZ2U6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDI2MDI4OTg2NTctM2U5MTc2MGNiYjM0P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgIGR1cmF0aW9uOiBcIjUgRGF5cyAvIDQgTmlnaHRzXCIsXG4gICAgICBwcmljZTogNzUwMDAsXG4gICAgICBvcmlnaW5hbFByaWNlOiA5NTAwMCxcbiAgICAgIHJhdGluZzogNC45LFxuICAgICAgcmV2aWV3czogMTIwMCxcbiAgICAgIGhpZ2hsaWdodHM6IFtcIkVpZmZlbCBUb3dlclwiLCBcIlNlaW5lIENydWlzZVwiLCBcIkNpdHkgVG91clwiLCBcIldpbmVcIl0sXG4gICAgICB0eXBlOiBcIlJvbWFudGljXCIsXG4gICAgICBkaXNjb3VudDogXCIyMSVcIixcbiAgICAgIGlzVG9wUGljazogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDEwMixcbiAgICAgIHRpdGxlOiBcIk1hbGRpdmVzIEx1eHVyeSBSZXRyZWF0XCIsXG4gICAgICBsb2NhdGlvbjogXCJNYWxkaXZlc1wiLFxuICAgICAgaW1hZ2U6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NzM4NDM5ODEyNjctYmUxOTk5ZmYzN2NkP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgIGR1cmF0aW9uOiBcIjQgRGF5cyAvIDMgTmlnaHRzXCIsXG4gICAgICBwcmljZTogODUwMDAsXG4gICAgICBvcmlnaW5hbFByaWNlOiAxMTAwMDAsXG4gICAgICByYXRpbmc6IDQuOSxcbiAgICAgIHJldmlld3M6IDk4MCxcbiAgICAgIGhpZ2hsaWdodHM6IFtcIldhdGVyIFZpbGxhXCIsIFwiU25vcmtlbGluZ1wiLCBcIlNwYVwiLCBcIlByaXZhdGUgQmVhY2hcIl0sXG4gICAgICB0eXBlOiBcIkx1eHVyeVwiLFxuICAgICAgZGlzY291bnQ6IFwiMjMlXCIsXG4gICAgICBpc1RvcFBpY2s6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAxMDMsXG4gICAgICB0aXRsZTogXCJTd2lzcyBBbHBzIEFkdmVudHVyZVwiLFxuICAgICAgbG9jYXRpb246IFwiU3dpdHplcmxhbmRcIixcbiAgICAgIGltYWdlOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTI3NjY4NzUyOTY4LTE0ZGM3MGEyN2M5NT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICBkdXJhdGlvbjogXCI2IERheXMgLyA1IE5pZ2h0c1wiLFxuICAgICAgcHJpY2U6IDkyMDAwLFxuICAgICAgb3JpZ2luYWxQcmljZTogMTIwMDAwLFxuICAgICAgcmF0aW5nOiA0LjgsXG4gICAgICByZXZpZXdzOiA4NTAsXG4gICAgICBoaWdobGlnaHRzOiBbXCJNb3VudGFpbnNcIiwgXCJDYWJsZSBDYXJcIiwgXCJTa2lpbmdcIiwgXCJMYWtlc1wiXSxcbiAgICAgIHR5cGU6IFwiQWR2ZW50dXJlXCIsXG4gICAgICBkaXNjb3VudDogXCIyMyVcIixcbiAgICAgIGlzVG9wUGljazogZmFsc2VcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAxMDQsXG4gICAgICB0aXRsZTogXCJKYXBhbiBDaGVycnkgQmxvc3NvbSBUb3VyXCIsXG4gICAgICBsb2NhdGlvbjogXCJKYXBhblwiLFxuICAgICAgaW1hZ2U6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjgxNjQzNDQ3MDUtNDc1NDI2ODcwMDBkP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgIGR1cmF0aW9uOiBcIjYgRGF5cyAvIDUgTmlnaHRzXCIsXG4gICAgICBwcmljZTogODgwMDAsXG4gICAgICBvcmlnaW5hbFByaWNlOiAxMDUwMDAsXG4gICAgICByYXRpbmc6IDQuOSxcbiAgICAgIHJldmlld3M6IDExMDAsXG4gICAgICBoaWdobGlnaHRzOiBbXCJTYWt1cmFcIiwgXCJUZW1wbGVzXCIsIFwiVG9reW8gVG91clwiLCBcIkN1bHR1cmVcIl0sXG4gICAgICB0eXBlOiBcIkN1bHR1cmFsXCIsXG4gICAgICBkaXNjb3VudDogXCIxNiVcIixcbiAgICAgIGlzVG9wUGljazogZmFsc2VcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAxMDUsXG4gICAgICB0aXRsZTogXCJOZXcgWW9yayBDaXR5IEV4cGxvcmVyXCIsXG4gICAgICBsb2NhdGlvbjogXCJVU0FcIixcbiAgICAgIGltYWdlOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTM0NDMwNDgwODcyLTM0OTgzODZlNzg1Nj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICBkdXJhdGlvbjogXCI1IERheXMgLyA0IE5pZ2h0c1wiLFxuICAgICAgcHJpY2U6IDc4MDAwLFxuICAgICAgb3JpZ2luYWxQcmljZTogOTkwMDAsXG4gICAgICByYXRpbmc6IDQuNyxcbiAgICAgIHJldmlld3M6IDEzNTAsXG4gICAgICBoaWdobGlnaHRzOiBbXCJUaW1lcyBTcXVhcmVcIiwgXCJTdGF0dWUgb2YgTGliZXJ0eVwiLCBcIkJyb2Fkd2F5XCIsIFwiQ2l0eSBUb3VyXCJdLFxuICAgICAgdHlwZTogXCJVcmJhblwiLFxuICAgICAgZGlzY291bnQ6IFwiMjElXCIsXG4gICAgICBpc1RvcFBpY2s6IGZhbHNlXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogMTA2LFxuICAgICAgdGl0bGU6IFwiSWNlbGFuZCBOb3J0aGVybiBMaWdodHNcIixcbiAgICAgIGxvY2F0aW9uOiBcIkljZWxhbmRcIixcbiAgICAgIGltYWdlOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDQ0NzAzNjg2OTgxLWEzYWJiYzRkNGZlMz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICBkdXJhdGlvbjogXCI1IERheXMgLyA0IE5pZ2h0c1wiLFxuICAgICAgcHJpY2U6IDk1MDAwLFxuICAgICAgb3JpZ2luYWxQcmljZTogMTIwMDAwLFxuICAgICAgcmF0aW5nOiA0LjksXG4gICAgICByZXZpZXdzOiA5MjAsXG4gICAgICBoaWdobGlnaHRzOiBbXCJBdXJvcmFcIiwgXCJHbGFjaWVyc1wiLCBcIldhdGVyZmFsbHNcIiwgXCJIb3QgU3ByaW5nc1wiXSxcbiAgICAgIHR5cGU6IFwiTmF0dXJlXCIsXG4gICAgICBkaXNjb3VudDogXCIyMSVcIixcbiAgICAgIGlzVG9wUGljazogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDEwNyxcbiAgICAgIHRpdGxlOiBcIkF1c3RyYWxpYSBDb2FzdGFsIERyaXZlXCIsXG4gICAgICBsb2NhdGlvbjogXCJBdXN0cmFsaWFcIixcbiAgICAgIGltYWdlOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDcwNzcwODQxMDcyLWY5NzhjZjRkMDE5ZT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICBkdXJhdGlvbjogXCI2IERheXMgLyA1IE5pZ2h0c1wiLFxuICAgICAgcHJpY2U6IDg3MDAwLFxuICAgICAgb3JpZ2luYWxQcmljZTogMTEwMDAwLFxuICAgICAgcmF0aW5nOiA0LjgsXG4gICAgICByZXZpZXdzOiA3ODAsXG4gICAgICBoaWdobGlnaHRzOiBbXCJHcmVhdCBPY2VhbiBSb2FkXCIsIFwiQmVhY2hlc1wiLCBcIldpbGRsaWZlXCIsIFwiQ2l0eSBUb3VyXCJdLFxuICAgICAgdHlwZTogXCJBZHZlbnR1cmVcIixcbiAgICAgIGRpc2NvdW50OiBcIjIxJVwiLFxuICAgICAgaXNUb3BQaWNrOiBmYWxzZVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDEwOCxcbiAgICAgIHRpdGxlOiBcIlR1cmtleSBDYXBwYWRvY2lhIERyZWFtc1wiLFxuICAgICAgbG9jYXRpb246IFwiVHVya2V5XCIsXG4gICAgICBpbWFnZTogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDYwODUyNDg0MS00MmZlNmYwMzJiNGI/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgZHVyYXRpb246IFwiNSBEYXlzIC8gNCBOaWdodHNcIixcbiAgICAgIHByaWNlOiA3MjAwMCxcbiAgICAgIG9yaWdpbmFsUHJpY2U6IDkwMDAwLFxuICAgICAgcmF0aW5nOiA0LjgsXG4gICAgICByZXZpZXdzOiA2NTAsXG4gICAgICBoaWdobGlnaHRzOiBbXCJIb3QgQWlyIEJhbGxvb25cIiwgXCJDYXZlc1wiLCBcIlN1bnJpc2UgVmlld3NcIiwgXCJDdWx0dXJlXCJdLFxuICAgICAgdHlwZTogXCJSb21hbnRpY1wiLFxuICAgICAgZGlzY291bnQ6IFwiMjAlXCIsXG4gICAgICBpc1RvcFBpY2s6IGZhbHNlXG4gICAgfVxuICBdO1xuXG4gIC8vIEV4aXN0aW5nIGRvbWVzdGljIHBhY2thZ2VzXG4gIGNvbnN0IGRvbWVzdGljUGFja2FnZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyMCB9LCAoXywgaSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlcyA9IFtcbiAgICAgIFwiR29hIEJlYWNoIEVzY2FwZVwiLFxuICAgICAgXCJLZXJhbGEgQmFja3dhdGVyc1wiLFxuICAgICAgXCJSYWphc3RoYW4gUm95YWwgVG91clwiLFxuICAgICAgXCJCYWxpIFJvbWFudGljIGdldGF3YXlcIixcbiAgICAgIFwiTWFuYWxpIFNub3cgQWR2ZW50dXJlXCIsXG4gICAgICBcIkR1YmFpIEx1eHVyeSBTaG9wcGluZ1wiLFxuICAgICAgXCJUaGFpbGFuZCBCZWFjaCBIb2xpZGF5XCIsXG4gICAgICBcIkthc2htaXIgVmFsbGV5IFRvdXJcIixcbiAgICAgIFwiQW5kYW1hbiBJc2xhbmRzIEdldGF3YXlcIixcbiAgICAgIFwiSGltYWxheWFuIFRyZWtraW5nXCIsXG4gICAgICBcIkxlaCBMYWRha2ggRXhwZWRpdGlvblwiLFxuICAgICAgXCJQb25kaWNoZXJyeSBIZXJpdGFnZVwiLFxuICAgICAgXCJTaWtraW0gTW91bnRhaW4gUmV0cmVhdFwiLFxuICAgICAgXCJNZWdoYWxheWEgQ2F2ZXMgQWR2ZW50dXJlXCIsXG4gICAgICBcIlZhcmFuYXNpIFNwaXJpdHVhbCBUb3VyXCIsXG4gICAgICBcIk11bWJhaSBDaXR5IExpZ2h0c1wiLFxuICAgICAgXCJIeWRlcmFiYWQgTml6YW1zIFRvdXJcIixcbiAgICAgIFwiR3VqYXJhdCBIZXJpdGFnZSBXYWxrXCIsXG4gICAgICBcIlRhbWlsIE5hZHUgVGVtcGxlIFRvdXJcIixcbiAgICAgIFwiS2FybmF0YWthIE1vbnVtZW50c1wiXG4gICAgXTtcbiAgICBjb25zdCBsb2NhdGlvbnMgPSBbXCJHb2FcIiwgXCJLZXJhbGFcIiwgXCJSYWphc3RoYW5cIiwgXCJCYWxpXCIsIFwiTWFuYWxpXCIsIFwiRHViYWlcIiwgXCJUaGFpbGFuZFwiLCBcIkthc2htaXJcIiwgXCJBbmRhbWFuXCIsIFwiTGFkYWtoXCIsIFwiTGVoXCIsIFwiUG9uZGljaGVycnlcIiwgXCJTaWtraW1cIiwgXCJNZWdoYWxheWFcIiwgXCJWYXJhbmFzaVwiLCBcIk11bWJhaVwiLCBcIkh5ZGVyYWJhZFwiLCBcIkd1amFyYXRcIiwgXCJUYW1pbCBOYWR1XCIsIFwiS2FybmF0YWthXCJdO1xuICAgIGNvbnN0IGR1cmF0aW9ucyA9IFtcIjQgRGF5cyAvIDMgTmlnaHRzXCIsIFwiNSBEYXlzIC8gNCBOaWdodHNcIiwgXCI2IERheXMgLyA1IE5pZ2h0c1wiXTtcbiAgICBjb25zdCBpbWFnZXNCeUxvY2F0aW9uID0ge1xuICAgICAgR29hOiBbXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzMxMTY3NjMyNDktMmZhYWVmODFjY2RhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3MzExNjc2MzI0OS0yZmFhZWY4MWNjZGE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDczMTE2NzYzMjQ5LTJmYWFlZjgxY2NkYT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzMxMTY3NjMyNDktMmZhYWVmODFjY2RhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIlxuICAgICAgXSxcbiAgICAgIEtlcmFsYTogW1xuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTkwMDU5ODQzMzM1LTJjMjdlMDcxMTJhMT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDY5Mjk1NjI4NzItYmI0MjE1MDNlZjIxP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MjczMzQwNy01ZDVjNDZjM2JiM2I/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc3NTkzNjIxOTk5LTRiYjk0Yjg3ZTQ1NT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCJcbiAgICAgIF0sXG4gICAgICBSYWphc3RoYW46IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5OTY2MTA0NjI4OS1lMzE4OTc4NDZlNDE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTk5NjYxMDQ2Mjg5LWUzMTg5Nzg0NmU0MT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1OTk2NjEwNDYyODktZTMxODk3ODQ2ZTQxP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5OTY2MTA0NjI4OS1lMzE4OTc4NDZlNDE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgQmFsaTogW1xuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTM3OTk2MTk0NDcxLWU2NTdkZjk3NWFiND9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NzA3ODkyNTMzODgtNTgyYzQ4MWM1NGIwP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMTU5MzM1ODI0MS03ZWVhMWYzYzg0ZTU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTE5NjgxMzkzNzg0LWQxMjAyNjc5MzNiYT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCJcbiAgICAgIF0sXG4gICAgICBNYW5hbGk6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0OTg4MDMzOC02NWRkY2RmZDAxN2I/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ5ODgwMzM4LTY1ZGRjZGZkMDE3Yj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDk4ODAzMzgtNjVkZGNkZmQwMTdiP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0OTg4MDMzOC02NWRkY2RmZDAxN2I/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgRHViYWk6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMjQ1Mzk3OTc5OC01ZWEyNjZmODg4MGM/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTE4Njg0MDc5LTNjODMwZGNlZjA5MD9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDYxODI5OTAtZGZmZWFmYmU4NDFkP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMjQ1Mzk3OTc5OC01ZWEyNjZmODg4MGM/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgVGhhaWxhbmQ6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwODAwOTYwMzg4NS01MGNmN2M1NzkzNjU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU4MTgwMDc3LTA5ZjE1OGM3NjRiOT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Nzg0MzYxMjc4OTctNzY5ZTFiM2YwZjM2P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzNTkzMDc0OTU3NC0xMzk5MzI3Y2U3OGY/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgS2FzaG1pcjogW1xuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTg3NzI5OTI3NTAyLTA2NTZjOWY3NTg5Mz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Nzg0MzYxMjc4OTctNzY5ZTFiM2YwZjM2P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNjkwNTkyNTM0Ni0yMWJkYTRkMzJkZjQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTIzOTA2ODM0NjU4LTZlMjRlZjIzODZmOT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCJcbiAgICAgIF0sXG4gICAgICBBbmRhbWFuOiBbXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTQyODI0MDEwNDctZDc5YTcxYTU5MGU4P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MjczMzQwNy01ZDVjNDZjM2JiM2I/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA3NTI1NDI4MDM0LWI3MjNjZjk2MWQzZT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDgwMTMxNDYtNzI0Nzk3NjhiYWRhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIlxuICAgICAgXSxcbiAgICAgIExhZGFraDogW1xuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDY0ODIyNzU5MDIzLWZlZDYyMmZmMmMzYj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjQ4MjI3NTkwMjMtZmVkNjIyZmYyYzNiP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2NDgyMjc1OTAyMy1mZWQ2MjJmZjJjM2I/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDY0ODIyNzU5MDIzLWZlZDYyMmZmMmMzYj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCJcbiAgICAgIF0sXG4gICAgICBMZWg6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNjkwNTkyNTM0Ni0yMWJkYTRkMzJkZjQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTgzNDIyNDA5NTE2LTI4OTVhNzdlZmRlZD9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE3ODU4ODgwNDEtYWYzZWYyODViNDcwP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwNTU5MDQyMzY0MS04NDU4ODU1ODFlNjE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgUG9uZGljaGVycnk6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUyNDQ5NjU4MzA5NS1kNDJiNGM4MmI0Zjk/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUyNzMzNDA3LTVkNWM0NmMzYmIzYj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDc1MjU0MjgwMzQtYjcyM2NmOTYxZDNlP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3NzU5MzYyMTk5OS00YmI5NGI4N2U0NTU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgU2lra2ltOiBbXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDQ3MzU3MTYtMzkyZmUyNDg5ZmZhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0NDczNTcxNi0zOTJmZTI0ODlmZmE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ0NzM1NzE2LTM5MmZlMjQ4OWZmYT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDQ3MzU3MTYtMzkyZmUyNDg5ZmZhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIlxuICAgICAgXSxcbiAgICAgIE1lZ2hhbGF5YTogW1xuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA2OTA1OTI1MzQ2LTIxYmRhNGQzMmRmND9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1ODM0MjI0MDk1MTYtMjg5NWE3N2VmZGVkP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMTc4NTg4ODA0MS1hZjNlZjI4NWI0NzA/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc4NDM2MTI3ODk3LTc2OWUxYjNmMGYzNj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCJcbiAgICAgIF0sXG4gICAgICBWYXJhbmFzaTogW1xuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTY2MDczNzcxMjU5LTZhODUwNjA5OTk0NT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDgwMTMxNDYtNzI0Nzk3NjhiYWRhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMDUzNDYyMzI4My0zMTJhYWRlNDg1Yjc/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTE5NjgxMzkzNzg0LWQxMjAyNjc5MzNiYT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCJcbiAgICAgIF0sXG4gICAgICBNdW1iYWk6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU2NzE1NzU3Nzg2Ny0wNWNjYjEzODhlNjY/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTY3MTU3NTc3ODY3LTA1Y2NiMTM4OGU2Nj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NjcxNTc1Nzc4NjctMDVjY2IxMzg4ZTY2P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU2NzE1NzU3Nzg2Ny0wNWNjYjEzODhlNjY/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgSHlkZXJhYmFkOiBbXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NjYwNzM3NzEyNTktNmE4NTA2MDk5OTQ1P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0ODAxMzE0Ni03MjQ3OTc2OGJhZGE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAwNTM0NjIzMjgzLTMxMmFhZGU0ODViNz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTk2ODEzOTM3ODQtZDEyMDI2NzkzM2JhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIlxuICAgICAgXSxcbiAgICAgIEd1amFyYXQ6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3NzU4NzQ1ODg4My00NzE0NWVkOTQyNDU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA2OTA1OTI1MzQ2LTIxYmRhNGQzMmRmND9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTk2ODEzOTM3ODQtZDEyMDI2NzkzM2JhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUyMzkwNjgzNDY1OC02ZTI0ZWYyMzg2Zjk/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgXCJUYW1pbCBOYWR1XCI6IFtcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5MDA1MDc1MjExNy0yMzhjYjBmYjEyYjE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTkwMDUwNzUyMTE3LTIzOGNiMGZiMTJiMT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1OTAwNTA3NTIxMTctMjM4Y2IwZmIxMmIxP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5MDA1MDc1MjExNy0yMzhjYjBmYjEyYjE/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiXG4gICAgICBdLFxuICAgICAgS2FybmF0YWthOiBbXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1OTM2OTM0MTE1MTUtYzIwMjYxYmNhZDZlP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5MzY5MzQxMTUxNS1jMjAyNjFiY2FkNmU/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MDAmcT04MFwiLFxuICAgICAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTkzNjkzNDExNTE1LWMyMDI2MWJjYWQ2ZT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTgwMCZxPTgwXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1OTM2OTM0MTE1MTUtYzIwMjYxYmNhZDZlP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIlxuICAgICAgXVxuICAgIH07XG4gICAgY29uc3QgdHlwZXMgPSBbXCJMRUlTVVJFXCIsIFwiTkFUVVJFXCIsIFwiSEVSSVRBR0VcIiwgXCJST01BTlRJQ1wiXTtcblxuICAgIGNvbnN0IGJhc2VQcmljZSA9IDEyMDAwICsgaSAqIDEyMDA7XG4gICAgY29uc3Qgb3JpZ2luYWxQcmljZSA9IE1hdGgucm91bmQoYmFzZVByaWNlICogMS4zKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpZDogaSArIDEsXG4gICAgICB0aXRsZTogdGl0bGVzW2kgJSAyMF0sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb25zW2kgJSAyMF0sXG4gICAgICBpbWFnZTogaW1hZ2VzQnlMb2NhdGlvbltsb2NhdGlvbnNbaSAlIDIwXV1baSAlIDRdLFxuICAgICAgZHVyYXRpb246IGR1cmF0aW9uc1tpICUgM10sXG4gICAgICBwcmljZTogYmFzZVByaWNlLFxuICAgICAgb3JpZ2luYWxQcmljZTogb3JpZ2luYWxQcmljZSxcbiAgICAgIHJhdGluZzogKDQgKyAoaSAlIDUpICogMC4xKS50b0ZpeGVkKDEpLFxuICAgICAgcmV2aWV3czogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjAwMCkgKyA1MDAsXG4gICAgICBoaWdobGlnaHRzOiBbJ0hvdGVsIFN0YXknLCAnVHJhbnNmZXJzJywgJ01lYWxzJywgJ1NpZ2h0c2VlaW5nJ10sXG4gICAgICB0eXBlOiB0eXBlc1tpICUgNF0sXG4gICAgICBkaXNjb3VudDogYCR7MjAgKyAoaSAlIDEwKX0lYCxcbiAgICAgIGlzVG9wUGljazogaSAlIDcgPT09IDBcbiAgICB9O1xuICB9KTtcblxuICBjb25zdCBwYWNrYWdlcyA9IFsuLi5uZXdQYWNrYWdlcywgLi4uZG9tZXN0aWNQYWNrYWdlc107XG5cbiAgY29uc3QgZmVhdHVyZXMgPSBbXG4gICAgeyBpY29uOiBDb21wYXNzLCB0aXRsZTogJ1BlcnNvbmFsaXplZCBNYXRjaGluZycsIGRlc2NyaXB0aW9uOiAnQUktcG93ZXJlZCByZWNvbW1lbmRhdGlvbnMgdGFpbG9yZWQganVzdCBmb3IgeW91JyB9LFxuICAgIHsgaWNvbjogR2xvYmUsIHRpdGxlOiAnV2lkZSBWYXJpZXR5IG9mIERlc3RpbmF0aW9ucycsIGRlc2NyaXB0aW9uOiAnRXhwbG9yZSAxMDArIGRlc3RpbmF0aW9ucyB3b3JsZHdpZGUnIH0sXG4gICAgeyBpY29uOiBTaGllbGQsIHRpdGxlOiAnSGlnaGx5IFF1YWxpZmllZCBTZXJ2aWNlJywgZGVzY3JpcHRpb246ICdDZXJ0aWZpZWQgcHJvZmVzc2lvbmFscyBhdCBldmVyeSBzdGVwJyB9LFxuICAgIHsgaWNvbjogSGVhZHBob25lcywgdGl0bGU6ICcyNC83IFN1cHBvcnQnLCBkZXNjcmlwdGlvbjogJ1JvdW5kLXRoZS1jbG9jayBhc3Npc3RhbmNlIHdoZXJldmVyIHlvdSB0cmF2ZWwnIH0sXG4gICAgeyBpY29uOiBIZWFydCwgdGl0bGU6ICdIYW5kcGlja2VkIEhvdGVscycsIGRlc2NyaXB0aW9uOiAnQ2FyZWZ1bGx5IHNlbGVjdGVkIGFjY29tbW9kYXRpb25zIGZvciBjb21mb3J0JyB9LFxuICAgIHsgaWNvbjogQXdhcmQsIHRpdGxlOiAnQmVzdCBQcmljZSBHdWFyYW50ZWUnLCBkZXNjcmlwdGlvbjogJ1dlIG1hdGNoIGFueSBjb21wZXRpdG9yIHByaWNlJyB9LFxuICBdO1xuXG4gIC8vIENhYiBwbGFjZWhvbGRlciBpbWFnZXNcbiAgY29uc3QgQ0FCX0lNQUdFUyA9IFtcbiAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0OTc2Mzg4NTMxLWQxMDU4NDk0Y2RkOD9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTQwMCZxPTgwXCIsXG4gICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzMzQ3MzM1OTMzMS0wMTM1ZWYxYjU4YWY/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz00MDAmcT04MFwiLFxuICAgIFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTk2NDE0NzE2NTQtNzZjZTAxMDdhZDFiP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NDAwJnE9ODBcIixcbiAgICBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAyODc3MzM4NTM1LTc2NmUxNDUyNjg0YT9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTQwMCZxPTgwXCIsXG4gICAgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1ODYxODY2Ni1mY2QyNWM4NWNkNjQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz00MDAmcT04MFwiLFxuICBdO1xuXG4gIC8vIFN0YXRpYyBjYWJzIGRhdGFcbiAgY29uc3QgY2FicyA9IFtcbiAgICB7XG4gICAgICBpZDogMSxcbiAgICAgIG1vZGVsOiAnTWFydXRpIFN3aWZ0JyxcbiAgICAgIHR5cGU6ICdFY29ub215JyxcbiAgICAgIHByaWNlOiAxODAwLFxuICAgICAgcmF0aW5nOiA0LjUsXG4gICAgICBkZXBhcnR1cmU6ICcwODowMCcsXG4gICAgICBhcnJpdmFsOiAnMTI6MDAnLFxuICAgICAgZHVyYXRpb246ICc0aCcsXG4gICAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ5MzE3NjYxLWJkMzJjOGNlMGRiMj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTQwMCZxPTgwJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAyLFxuICAgICAgbW9kZWw6ICdUb3lvdGEgRXRpb3MnLFxuICAgICAgdHlwZTogJ1NlZGFuJyxcbiAgICAgIHByaWNlOiAyNDAwLFxuICAgICAgcmF0aW5nOiA0LjcsXG4gICAgICBkZXBhcnR1cmU6ICcxMDowMCcsXG4gICAgICBhcnJpdmFsOiAnMTQ6MDAnLFxuICAgICAgZHVyYXRpb246ICc0aCcsXG4gICAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUyNTE5NTA3LWRhM2IxNDJjNmUzZD9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTQwMCZxPTgwJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAzLFxuICAgICAgbW9kZWw6ICdNYWhpbmRyYSBTY29ycGlvJyxcbiAgICAgIHR5cGU6ICdTVVYnLFxuICAgICAgcHJpY2U6IDM1MDAsXG4gICAgICByYXRpbmc6IDQuNixcbiAgICAgIGRlcGFydHVyZTogJzE0OjAwJyxcbiAgICAgIGFycml2YWw6ICcxODowMCcsXG4gICAgICBkdXJhdGlvbjogJzRoJyxcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTk2NDE0NzE2NTQtNzZjZTAxMDdhZDFiP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NDAwJnE9ODAnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDQsXG4gICAgICBtb2RlbDogJ0hvbmRhIENpdHknLFxuICAgICAgdHlwZTogJ1ByZW1pdW0nLFxuICAgICAgcHJpY2U6IDMyMDAsXG4gICAgICByYXRpbmc6IDQuOCxcbiAgICAgIGRlcGFydHVyZTogJzE2OjAwJyxcbiAgICAgIGFycml2YWw6ICcyMDowMCcsXG4gICAgICBkdXJhdGlvbjogJzRoJyxcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDI4NzczMzg1MzUtNzY2ZTE0NTI2ODRhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NDAwJnE9ODAnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDUsXG4gICAgICBtb2RlbDogJ1RveW90YSBJbm5vdmEnLFxuICAgICAgdHlwZTogJ1NVVicsXG4gICAgICBwcmljZTogMzgwMCxcbiAgICAgIHJhdGluZzogNC43LFxuICAgICAgZGVwYXJ0dXJlOiAnMTg6MDAnLFxuICAgICAgYXJyaXZhbDogJzIyOjAwJyxcbiAgICAgIGR1cmF0aW9uOiAnNGgnLFxuICAgICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzMzQ3MzM1OTMzMS0wMTM1ZWYxYjU4YWY/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz00MDAmcT04MCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogNixcbiAgICAgIG1vZGVsOiAnSG9uZGEgQW1hemUnLFxuICAgICAgdHlwZTogJ0Vjb25vbXknLFxuICAgICAgcHJpY2U6IDE2MDAsXG4gICAgICByYXRpbmc6IDQuNCxcbiAgICAgIGRlcGFydHVyZTogJzA2OjAwJyxcbiAgICAgIGFycml2YWw6ICcxMDowMCcsXG4gICAgICBkdXJhdGlvbjogJzRoJyxcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTAzNTUyOTEtYmJlZTA0YTkyMDI3P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODAnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDcsXG4gICAgICBtb2RlbDogJ01lcmNlZGVzIEUtQ2xhc3MnLFxuICAgICAgdHlwZTogJ1ByZW1pdW0nLFxuICAgICAgcHJpY2U6IDU1MDAsXG4gICAgICByYXRpbmc6IDQuOSxcbiAgICAgIGRlcGFydHVyZTogJzA5OjAwJyxcbiAgICAgIGFycml2YWw6ICcxMzowMCcsXG4gICAgICBkdXJhdGlvbjogJzRoJyxcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MTg4NDM0NzkzMTMtNDBmOGFmYjRiNGQ4P2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9NDAwJnE9ODAnLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDgsXG4gICAgICBtb2RlbDogJ0h5dW5kYWkgVmVybmEnLFxuICAgICAgdHlwZTogJ1NlZGFuJyxcbiAgICAgIHByaWNlOiAyMjAwLFxuICAgICAgcmF0aW5nOiA0LjYsXG4gICAgICBkZXBhcnR1cmU6ICcxMTowMCcsXG4gICAgICBhcnJpdmFsOiAnMTU6MDAnLFxuICAgICAgZHVyYXRpb246ICc0aCcsXG4gICAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU2MTg5MjUwLTcyYmE5NTRjZmMwYj9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTQwMCZxPTgwJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiA5LFxuICAgICAgbW9kZWw6ICdNYWhpbmRyYSBYVVY1MDAnLFxuICAgICAgdHlwZTogJ1NVVicsXG4gICAgICBwcmljZTogMzIwMCxcbiAgICAgIHJhdGluZzogNC41LFxuICAgICAgZGVwYXJ0dXJlOiAnMTM6MDAnLFxuICAgICAgYXJyaXZhbDogJzE3OjAwJyxcbiAgICAgIGR1cmF0aW9uOiAnNGgnLFxuICAgICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxOTY0MTQ3MTY1NC03NmNlMDEwN2FkMWI/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz00MDAmcT04MCcsXG4gICAgfSxcbiAgXTtcblxuICAvLyBGaWx0ZXIgc3RhdGVcbiAgY29uc3QgW2ZpbHRlcnMsIHNldEZpbHRlcnNdID0gdXNlU3RhdGUoe1xuICAgIHN0b3BzOiBbXSxcbiAgICBkZXBhcnR1cmVUaW1lczogW10sXG4gICAgbWluUHJpY2U6ICcnLFxuICAgIG1heFByaWNlOiAnJyxcbiAgICBhaXJsaW5lczogW10sXG4gIH0pO1xuXG4gIC8vIENhYiBoYW5kbGVycyAoc3RhdGUgYWxyZWFkeSBkZWNsYXJlZCBhYm92ZSlcbiAgY29uc3QgaGFuZGxlQ2FiQ2hlY2tib3ggPSAoY2F0ZWdvcnksIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgY3VycmVudCA9IGNhYkZpbHRlcnNbY2F0ZWdvcnldIHx8IFtdO1xuICAgIGNvbnN0IHVwZGF0ZWQgPSBjdXJyZW50LmluY2x1ZGVzKHZhbHVlKVxuICAgICAgPyBjdXJyZW50LmZpbHRlcigodikgPT4gdiAhPT0gdmFsdWUpXG4gICAgICA6IFsuLi5jdXJyZW50LCB2YWx1ZV07XG4gICAgc2V0Q2FiRmlsdGVycygocHJldikgPT4gKHsgLi4ucHJldiwgW2NhdGVnb3J5XTogdXBkYXRlZCB9KSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ2FiUHJpY2VDaGFuZ2UgPSAodHlwZSwgdmFsdWUpID0+IHtcbiAgICBzZXRDYWJGaWx0ZXJzKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBbdHlwZV06IHZhbHVlIH0pKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVDYWJSZXNldCA9ICgpID0+IHtcbiAgICBzZXRDYWJGaWx0ZXJzKHtcbiAgICAgIGNhYlR5cGVzOiBbXSxcbiAgICAgIG1pblByaWNlOiAnJyxcbiAgICAgIG1heFByaWNlOiAnJyxcbiAgICAgIGRlcGFydHVyZVRpbWVzOiBbXSxcbiAgICAgIHN0b3BzOiBbXSxcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBnZXRDYWJUaW1lQnVja2V0ID0gKHRpbWUpID0+IHtcbiAgICBjb25zdCBob3VyID0gcGFyc2VJbnQodGltZS5zcGxpdCgnOicpWzBdKTtcbiAgICBpZiAoaG91ciA+PSAwICYmIGhvdXIgPCA2KSByZXR1cm4gJ2Vhcmx5TW9ybmluZyc7XG4gICAgaWYgKGhvdXIgPj0gNiAmJiBob3VyIDwgMTIpIHJldHVybiAnbW9ybmluZyc7XG4gICAgaWYgKGhvdXIgPj0gMTIgJiYgaG91ciA8IDE2KSByZXR1cm4gJ2FmdGVybm9vbic7XG4gICAgaWYgKGhvdXIgPj0gMTYgJiYgaG91ciA8IDIwKSByZXR1cm4gJ2V2ZW5pbmcnO1xuICAgIHJldHVybiAnbmlnaHQnO1xuICB9O1xuXG4gIC8vIEZpbHRlcmVkIGFuZCBzb3J0ZWQgY2Fic1xuICBjb25zdCBmaWx0ZXJlZENhYnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBsZXQgcmVzdWx0ID0gWy4uLmNhYnNdO1xuICAgIGlmIChjYWJGaWx0ZXJzLmNhYlR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoKGNhYikgPT4gY2FiRmlsdGVycy5jYWJUeXBlcy5pbmNsdWRlcyhjYWIudHlwZSkpO1xuICAgIH1cbiAgICBpZiAoY2FiRmlsdGVycy5taW5QcmljZSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcigoY2FiKSA9PiBjYWIucHJpY2UgPj0gcGFyc2VJbnQoY2FiRmlsdGVycy5taW5QcmljZSkpO1xuICAgIH1cbiAgICBpZiAoY2FiRmlsdGVycy5tYXhQcmljZSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcigoY2FiKSA9PiBjYWIucHJpY2UgPD0gcGFyc2VJbnQoY2FiRmlsdGVycy5tYXhQcmljZSkpO1xuICAgIH1cbiAgICBpZiAoY2FiRmlsdGVycy5kZXBhcnR1cmVUaW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKChjYWIpID0+IHtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gZ2V0Q2FiVGltZUJ1Y2tldChjYWIuZGVwYXJ0dXJlKTtcbiAgICAgICAgcmV0dXJuIGNhYkZpbHRlcnMuZGVwYXJ0dXJlVGltZXMuaW5jbHVkZXMoYnVja2V0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCBbY2FicywgY2FiRmlsdGVyc10pO1xuXG4gIGNvbnN0IHNvcnRlZENhYnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBzb3J0ZWQgPSBbLi4uZmlsdGVyZWRDYWJzXTtcbiAgICBzd2l0Y2ggKGNhYlNvcnRCeSkge1xuICAgICAgY2FzZSAncHJpY2VfbG93JzpcbiAgICAgICAgcmV0dXJuIHNvcnRlZC5zb3J0KChhLCBiKSA9PiBhLnByaWNlIC0gYi5wcmljZSk7XG4gICAgICBjYXNlICdwcmljZV9oaWdoJzpcbiAgICAgICAgcmV0dXJuIHNvcnRlZC5zb3J0KChhLCBiKSA9PiBiLnByaWNlIC0gYS5wcmljZSk7XG4gICAgICBjYXNlICdyYXRpbmcnOlxuICAgICAgICByZXR1cm4gc29ydGVkLnNvcnQoKGEsIGIpID0+IGIucmF0aW5nIC0gYS5yYXRpbmcpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHNvcnRlZDtcbiAgICB9XG4gIH0sIFtmaWx0ZXJlZENhYnMsIGNhYlNvcnRCeV0pO1xuXG4gIGNvbnN0IG1pbkNhYlByaWNlID0gZmlsdGVyZWRDYWJzLmxlbmd0aCA+IDAgPyBNYXRoLm1pbiguLi5maWx0ZXJlZENhYnMubWFwKChjKSA9PiBjLnByaWNlKSkgOiBudWxsO1xuXG4gIC8vIENhYiBib29raW5nIGhhbmRsZXJcbiAgY29uc3QgaGFuZGxlQm9va0NhYiA9IChjYWIpID0+IHtcbiAgICBoYW5kbGVCb29raW5nKG5hdmlnYXRlLCAnY2FiJywgY2FiLCB7IHBhc3NlbmdlcnMgfSk7XG4gIH07XG5cbiAgLy8gRmV0Y2ggZGF0YSBmcm9tIEFQSSB3aGVuIHNlYXJjaCBwYXJhbWV0ZXJzIGNoYW5nZVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoRGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIC8vIENsZWFyIHByZXZpb3VzIGRhdGFcbiAgICAgIHNldEZsaWdodHMoW10pO1xuICAgICAgc2V0VHJhaW5zKFtdKTtcbiAgICAgIHNldEVycm9yKG51bGwpO1xuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcblxuICAgICAgaWYgKHR5cGUgPT09ICdmbGlnaHRzJykge1xuICAgICAgICBpZiAoc291cmNlICYmIGRlc3RpbmF0aW9uICYmIHNvdXJjZSA9PT0gZGVzdGluYXRpb24pIHtcbiAgICAgICAgICBzZXRFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBjYW5ub3QgYmUgdGhlIHNhbWUuIFBsZWFzZSBjaG9vc2UgZGlmZmVyZW50IGNpdGllcy4nKTtcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc291cmNlICYmIGRlc3RpbmF0aW9uKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGBodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpL2ZsaWdodHNgLCB7XG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLnRyaW0oKSxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb24udHJpbSgpLFxuICAgICAgICAgICAgICAgIGRhdGU6IGRhdGUgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRGbGlnaHRzKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgc2V0SXNTaG93Y2FzZU1vZGUoZmFsc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNc2cgPSBlcnIucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgYEZhaWxlZCB0byBmZXRjaCBmbGlnaHRzIGZyb20gJHtzb3VyY2V9IHRvICR7ZGVzdGluYXRpb259LiBQbGVhc2UgdHJ5IGFnYWluLmA7XG4gICAgICAgICAgICBzZXRFcnJvcihlcnJvck1zZyk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYGh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hcGkvZmxpZ2h0cy9yYW5kb21gKTtcbiAgICAgICAgICAgIHNldEZsaWdodHMocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICBzZXRJc1Nob3djYXNlTW9kZSh0cnVlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNldEVycm9yKCdGYWlsZWQgdG8gbG9hZCBmZWF0dXJlZCBmbGlnaHRzLiBQbGVhc2UgdHJ5IGFnYWluLicpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3RyYWlucycpIHtcbiAgICAgICAgaWYgKHNvdXJjZSAmJiBkZXN0aW5hdGlvbiAmJiBzb3VyY2UgPT09IGRlc3RpbmF0aW9uKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ1NvdXJjZSBhbmQgZGVzdGluYXRpb24gY2Fubm90IGJlIHRoZSBzYW1lLiBQbGVhc2UgY2hvb3NlIGRpZmZlcmVudCBjaXRpZXMuJyk7XG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaS90cmFpbnNgLCB7XG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2UudHJpbSgpLFxuICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb24udHJpbSgpLFxuICAgICAgICAgICAgICBkYXRlOiBkYXRlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2V0VHJhaW5zKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgIHNldElzU2hvd2Nhc2VNb2RlKCEoc291cmNlICYmIGRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnN0IGVycm9yTXNnID0gZXJyLnJlc3BvbnNlPy5kYXRhPy5tZXNzYWdlIHx8IGBGYWlsZWQgdG8gZmV0Y2ggdHJhaW5zIGZyb20gJHtzb3VyY2V9IHRvICR7ZGVzdGluYXRpb259LiBQbGVhc2UgdHJ5IGFnYWluLmA7XG4gICAgICAgICAgc2V0RXJyb3IoZXJyb3JNc2cpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjYWJzJykge1xuICAgICAgICAvLyBDYWJzIGRhdGEgaXMgc3RhdGljLCBubyBBUEkgZmV0Y2ggbmVlZGVkXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgICAgLy8gUGFja2FnZXMgaGFuZGxlZCBzZXBhcmF0ZWx5IGJlbG93XG4gICAgfTtcblxuICAgIGZldGNoRGF0YSgpO1xuICB9LCBbdHlwZSwgc291cmNlLCBkZXN0aW5hdGlvbiwgZGF0ZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGxvY2F0aW9uLnN0YXRlPy5ib29raW5nU3VjY2Vzcykge1xuICAgICAgc2V0Qm9va2luZ1N0YXR1cyh7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6IGxvY2F0aW9uLnN0YXRlLm1lc3NhZ2UgfHwgJ0Jvb2tpbmcgY29uZmlybWVkIScgfSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbmF2aWdhdGUoJy4nLCB7IHJlcGxhY2U6IHRydWUsIHN0YXRlOiB7fSB9KTtcbiAgICAgIH0sIDUwMDApO1xuICAgIH1cbiAgfSwgW2xvY2F0aW9uLnN0YXRlLCBuYXZpZ2F0ZV0pO1xuXG4gIGNvbnN0IGZpbHRlcmVkRmxpZ2h0cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGxldCBmaWx0ZXJlZCA9IGZsaWdodHM7XG5cbiAgICBpZiAoZmlsdGVycy5zdG9wcy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcigoZikgPT4gZmlsdGVycy5zdG9wcy5pbmNsdWRlcyhmLnN0b3BzKSk7XG4gICAgfVxuXG4gICAgaWYgKGZpbHRlcnMubWluUHJpY2UpIHtcbiAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKChmKSA9PiBmLnByaWNlID49IHBhcnNlSW50KGZpbHRlcnMubWluUHJpY2UpKTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMubWF4UHJpY2UpIHtcbiAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKChmKSA9PiBmLnByaWNlIDw9IHBhcnNlSW50KGZpbHRlcnMubWF4UHJpY2UpKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsdGVycy5haXJsaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcigoZikgPT4gZmlsdGVycy5haXJsaW5lcy5pbmNsdWRlcyhmLmFpcmxpbmUpKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsdGVycy5kZXBhcnR1cmVUaW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlcmVkLmZpbHRlcigoZikgPT4ge1xuICAgICAgICBjb25zdCBbaG91cl0gPSBmLmRlcGFydHVyZVRpbWUuc3BsaXQoJzonKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gT2JqZWN0LmtleXMoVElNRV9CVUNLRVRfUkFOR0VTKS5maW5kKChiKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBUSU1FX0JVQ0tFVF9SQU5HRVNbYl07XG4gICAgICAgICAgcmV0dXJuIGhvdXIgPj0gc3RhcnQgJiYgaG91ciA8IGVuZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBidWNrZXQgJiYgZmlsdGVycy5kZXBhcnR1cmVUaW1lcy5pbmNsdWRlcyhidWNrZXQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcmVkO1xuICB9LCBbZmxpZ2h0cywgZmlsdGVyc10pO1xuXG4gIC8vIEZpbHRlciB0cmFpbnMgKG1hcHBpbmcgc3RvcHMgc3RyaW5ncyB0byBudW1lcmljIGZpbHRlciB2YWx1ZXMpXG4gIGNvbnN0IGZpbHRlcmVkVHJhaW5zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IGZpbHRlcmVkID0gdHJhaW5zO1xuXG4gICAgaWYgKGZpbHRlcnMuc3RvcHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIoKHQpID0+IHtcbiAgICAgICAgLy8gTWFwIHRyYWluIHN0b3Agc3RyaW5nIHRvIG51bWVyaWMgZmlsdGVyIHZhbHVlICgwPU5vbi1zdG9wLCAxPTEgU3RvcCwgMj0yKylcbiAgICAgICAgbGV0IG51bWVyaWNTdG9wO1xuICAgICAgICBpZiAodC5zdG9wcyA9PT0gJ05vbi1zdG9wJykgbnVtZXJpY1N0b3AgPSAwO1xuICAgICAgICBlbHNlIGlmICh0LnN0b3BzID09PSAnMSBTdG9wJykgbnVtZXJpY1N0b3AgPSAxO1xuICAgICAgICBlbHNlIG51bWVyaWNTdG9wID0gMjsgLy8gYW55dGhpbmcgd2l0aCAyIG9yIG1vcmUgc3RvcHNcbiAgICAgICAgcmV0dXJuIGZpbHRlcnMuc3RvcHMuaW5jbHVkZXMobnVtZXJpY1N0b3ApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZpbHRlcnMubWluUHJpY2UpIHtcbiAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKCh0KSA9PiB0LnByaWNlID49IHBhcnNlSW50KGZpbHRlcnMubWluUHJpY2UpKTtcbiAgICB9XG4gICAgaWYgKGZpbHRlcnMubWF4UHJpY2UpIHtcbiAgICAgIGZpbHRlcmVkID0gZmlsdGVyZWQuZmlsdGVyKCh0KSA9PiB0LnByaWNlIDw9IHBhcnNlSW50KGZpbHRlcnMubWF4UHJpY2UpKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsdGVycy5haXJsaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBGb3IgdHJhaW5zLCAnYWlybGluZXMnIGZpbHRlciBiZWNvbWVzICd0cmFpblR5cGVzJ1xuICAgICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIoKHQpID0+IGZpbHRlcnMuYWlybGluZXMuaW5jbHVkZXModC50eXBlKSk7XG4gICAgfVxuXG4gICAgaWYgKGZpbHRlcnMuZGVwYXJ0dXJlVGltZXMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIoKHQpID0+IHtcbiAgICAgICAgY29uc3QgW2hvdXJdID0gdC5kZXBhcnR1cmUuc3BsaXQoJzonKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gT2JqZWN0LmtleXMoVElNRV9CVUNLRVRfUkFOR0VTKS5maW5kKChiKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBUSU1FX0JVQ0tFVF9SQU5HRVNbYl07XG4gICAgICAgICAgcmV0dXJuIGhvdXIgPj0gc3RhcnQgJiYgaG91ciA8IGVuZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBidWNrZXQgJiYgZmlsdGVycy5kZXBhcnR1cmVUaW1lcy5pbmNsdWRlcyhidWNrZXQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcmVkO1xuICB9LCBbdHJhaW5zLCBmaWx0ZXJzXSk7XG5cbiAgLy8gU29ydCB0cmFpbnMgKHNhbWUgbG9naWMgYXMgZmxpZ2h0cylcbiAgY29uc3Qgc29ydGVkVHJhaW5zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgbGV0IHNvcnRlZCA9IFsuLi5maWx0ZXJlZFRyYWluc107XG5cbiAgICBpZiAodHJhaW5Tb3J0QnkgPT09ICdwcmljZScpIHtcbiAgICAgIHNvcnRlZC5zb3J0KChhLCBiKSA9PiBhLnByaWNlIC0gYi5wcmljZSk7XG4gICAgfSBlbHNlIGlmICh0cmFpblNvcnRCeSA9PT0gJ3ByaWNlLWhpZ2gnKSB7XG4gICAgICBzb3J0ZWQuc29ydCgoYSwgYikgPT4gYi5wcmljZSAtIGEucHJpY2UpO1xuICAgIH0gZWxzZSBpZiAodHJhaW5Tb3J0QnkgPT09ICdkZXBhcnR1cmUnKSB7XG4gICAgICBzb3J0ZWQuc29ydCgoYSwgYikgPT4gYS5kZXBhcnR1cmUubG9jYWxlQ29tcGFyZShiLmRlcGFydHVyZSkpO1xuICAgIH0gZWxzZSBpZiAodHJhaW5Tb3J0QnkgPT09ICdkdXJhdGlvbicpIHtcbiAgICAgIHNvcnRlZC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFEdXJhdGlvbiA9IHBhcnNlSW50KGEuZHVyYXRpb24ucmVwbGFjZSgnaCcsICcnKS5yZXBsYWNlKCdtJywgJycpLnNwbGl0KCcgJylbMF0pICogNjAgKyBwYXJzZUludChhLmR1cmF0aW9uLm1hdGNoKC8oXFxkKyltLyk/LlsxXSB8fCAwKTtcbiAgICAgICAgY29uc3QgYkR1cmF0aW9uID0gcGFyc2VJbnQoYi5kdXJhdGlvbi5yZXBsYWNlKCdoJywgJycpLnJlcGxhY2UoJ20nLCAnJykuc3BsaXQoJyAnKVswXSkgKiA2MCArIHBhcnNlSW50KGIuZHVyYXRpb24ubWF0Y2goLyhcXGQrKW0vKT8uWzFdIHx8IDApO1xuICAgICAgICByZXR1cm4gYUR1cmF0aW9uIC0gYkR1cmF0aW9uO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0cmFpblNvcnRCeSA9PT0gJ3JlY29tbWVuZGVkJyB8fCB0cmFpblNvcnRCeSA9PT0gJycpIHtcbiAgICAgIC8vIFJlY29tbWVuZGVkOiBzaG9ydGVzdCBkdXJhdGlvbiBmaXJzdCwgdGhlbiBieSBwcmljZVxuICAgICAgc29ydGVkLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYUR1cmF0aW9uID0gcGFyc2VJbnQoYS5kdXJhdGlvbi5yZXBsYWNlKCdoJywgJycpLnJlcGxhY2UoJ20nLCAnJykuc3BsaXQoJyAnKVswXSkgKiA2MCArIHBhcnNlSW50KGEuZHVyYXRpb24ubWF0Y2goLyhcXGQrKW0vKT8uWzFdIHx8IDApO1xuICAgICAgICBjb25zdCBiRHVyYXRpb24gPSBwYXJzZUludChiLmR1cmF0aW9uLnJlcGxhY2UoJ2gnLCAnJykucmVwbGFjZSgnbScsICcnKS5zcGxpdCgnICcpWzBdKSAqIDYwICsgcGFyc2VJbnQoYi5kdXJhdGlvbi5tYXRjaCgvKFxcZCspbS8pPy5bMV0gfHwgMCk7XG4gICAgICAgIGlmIChhRHVyYXRpb24gIT09IGJEdXJhdGlvbikgcmV0dXJuIGFEdXJhdGlvbiAtIGJEdXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIGEucHJpY2UgLSBiLnByaWNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvcnRlZDtcbiAgfSwgW2ZpbHRlcmVkVHJhaW5zLCB0cmFpblNvcnRCeV0pO1xuXG4gIGNvbnN0IGhhbmRsZUJvb2sgPSAoZmxpZ2h0KSA9PiB7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBhbGVydCgnUGxlYXNlIGxvZ2luIHRvIGJvb2sgYSBmbGlnaHQnKTtcbiAgICAgIG5hdmlnYXRlKCcvbG9naW4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlQm9va2luZyhuYXZpZ2F0ZSwgJ2ZsaWdodCcsIGZsaWdodCwgeyBwYXNzZW5nZXJzIH0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVZpZXdEZXRhaWxzID0gKGZsaWdodCkgPT4ge1xuICAgIGNvbnN0IHN0b3BzVGV4dCA9IGZsaWdodC5zdG9wcyA9PT0gMCA/ICdOb24tc3RvcCcgOiBmbGlnaHQuc3RvcHMgPT09IDEgPyAnMSBTdG9wJyA6IGAke2ZsaWdodC5zdG9wc30gU3RvcHNgO1xuICAgIGFsZXJ0KGBGbGlnaHQgJHtmbGlnaHQuZmxpZ2h0TnVtYmVyfVxcbkFpcmxpbmU6ICR7ZmxpZ2h0LmFpcmxpbmV9XFxuUm91dGU6ICR7ZmxpZ2h0LnNvdXJjZX0g4oaSICR7ZmxpZ2h0LmRlc3RpbmF0aW9ufVxcbkRlcGFydHVyZTogJHtmbGlnaHQuZGVwYXJ0dXJlVGltZX1cXG5BcnJpdmFsOiAke2ZsaWdodC5hcnJpdmFsVGltZX1cXG5EdXJhdGlvbjogJHtmbGlnaHQuZHVyYXRpb259XFxuU3RvcHM6ICR7c3RvcHNUZXh0fVxcblByaWNlOiDigrkke2ZsaWdodC5wcmljZS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVCb29rVHJhaW4gPSAodHJhaW4pID0+IHtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgbG9naW4gdG8gYm9vayBhIHRyYWluJyk7XG4gICAgICBuYXZpZ2F0ZSgnL2xvZ2luJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIE5hdmlnYXRlIHRvIGNoZWNrb3V0IHBhZ2Ugd2l0aCB0cmFpbiBkYXRhXG4gICAgaGFuZGxlQm9va2luZyhuYXZpZ2F0ZSwgJ3RyYWluJywgdHJhaW4sIHsgcGFzc2VuZ2VycyB9KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVWaWV3VHJhaW5EZXRhaWxzID0gKHRyYWluKSA9PiB7XG4gICAgYWxlcnQoYFRyYWluICR7dHJhaW4udHJhaW5OdW1iZXJ9XFxuTmFtZTogJHt0cmFpbi5uYW1lfVxcblJvdXRlOiAke3RyYWluLnNvdXJjZX0g4oaSICR7dHJhaW4uZGVzdGluYXRpb259XFxuRGVwYXJ0dXJlOiAke3RyYWluLmRlcGFydHVyZX1cXG5BcnJpdmFsOiAke3RyYWluLmFycml2YWx9XFxuRHVyYXRpb246ICR7dHJhaW4uZHVyYXRpb259XFxuU3RvcHM6ICR7dHJhaW4uc3RvcHN9XFxuQ2xhc3M6ICR7dHJhaW4uY2xhc3N9XFxuUHJpY2U6IOKCuSR7dHJhaW4ucHJpY2UudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9YCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUGFja2FnZUJvb2sgPSAocGtnKSA9PiB7XG4gICAgaGFuZGxlQm9va2luZyhuYXZpZ2F0ZSwgJ3BhY2thZ2UnLCBwa2csIHsgcGFzc2VuZ2VycyB9KTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb25zIChtdXN0IGJlIGluc2lkZSBjb21wb25lbnQgdG8gYWNjZXNzIHN0YXRlKVxuICBjb25zdCBnZXRSb3V0ZVRpdGxlID0gKCkgPT4ge1xuICAgIGlmIChpc1Nob3djYXNlTW9kZSkge1xuICAgICAgcmV0dXJuIHR5cGUgPT09ICd0cmFpbnMnID8gJ0V4cGxvcmUgUG9wdWxhciBUcmFpbnMnIDogJ0V4cGxvcmUgUG9wdWxhciBGbGlnaHRzJztcbiAgICB9XG4gICAgY29uc3Qgc3JjID0gc291cmNlIHx8ICdEZWxoaSc7XG4gICAgY29uc3QgZGVzdCA9IGRlc3RpbmF0aW9uIHx8ICdNdW1iYWknO1xuICAgIHJldHVybiBgJHtzcmN9IOKGkiAke2Rlc3R9YDtcbiAgfTtcblxuICBjb25zdCBnZXRTdWJ0aXRsZSA9ICgpID0+IHtcbiAgICBjb25zdCBjb3VudCA9IHR5cGUgPT09ICd0cmFpbnMnID8gZmlsdGVyZWRUcmFpbnMubGVuZ3RoIDogZmlsdGVyZWRGbGlnaHRzLmxlbmd0aDtcbiAgICBjb25zdCBpdGVtID0gdHlwZSA9PT0gJ3RyYWlucycgPyAndHJhaW4nIDogJ2ZsaWdodCc7XG4gICAgaWYgKGlzU2hvd2Nhc2VNb2RlKSB7XG4gICAgICByZXR1cm4gYERpc2NvdmVyIG91ciBmZWF0dXJlZCAke3R5cGUgPT09ICd0cmFpbnMnID8gJ3RyYWlucycgOiAnZmxpZ2h0cyd9IGFjcm9zcyBJbmRpYWA7XG4gICAgfVxuICAgIHJldHVybiBgJHtjb3VudH0gJHtpdGVtfXMgYXZhaWxhYmxlJHtzb3VyY2UgJiYgZGVzdGluYXRpb24gJiYgc291cmNlICE9PSBkZXN0aW5hdGlvbiAmJiBgIGZyb20gJHtzb3VyY2V9IHRvICR7ZGVzdGluYXRpb259YH1gO1xuICB9O1xuXG4gIC8vIFJlbmRlciBQYWNrYWdlcyBVSVxuICBpZiAodHlwZSA9PT0gJ3BhY2thZ2VzJykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBiZy1ncmFkaWVudC10by1iciBmcm9tLWdyYXktNTAgdmlhLWJsdWUtNTAvMTAgdG8tcHVycGxlLTUwLzEwXCI+XG4gICAgICAgIHsvKiBXYXZlIERpdmlkZXIgU1ZHICovfVxuICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0wIGxlZnQtMCB3LWZ1bGwgaC0yNCB0ZXh0LWdyYXktNTBcIiB2aWV3Qm94PVwiMCAwIDE0NDAgMTIwXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIj5cbiAgICAgICAgICA8cGF0aCBmaWxsPVwiY3VycmVudENvbG9yXCIgZD1cIk0wLDY0TDQ4LDY5LjNDOTYsNzUsMTkyLDg1LDI4OCw4MEMzODQsNzUsNDgwLDUzLDU3Niw0OEM2NzIsNDMsNzY4LDUzLDg2NCw2NEM5NjAsNzUsMTA1Niw4NSwxMTUyLDgwQzEyNDgsNzUsMTM0NCw1MywxMzkyLDQyLjdMMTQ0MCwzMkwxNDQwLDEyMEwxMzkyLDEyMEMxMzQ0LDEyMCwxMjQ4LDEyMCwxMTUyLDEyMEMxMDU2LDEyMCw5NjAsMTIwLDg2NCwxMjBDNzY4LDEyMCw2NzIsMTIwLDU3NiwxMjBDNDgwLDEyMCwzODQsMTIwLDI4OCwxMjBDMTkyLDEyMCw5NiwxMjAsNDgsMTIwTDAsMTIwWlwiPjwvcGF0aD5cbiAgICAgICAgPC9zdmc+XG5cbiAgICAgICAgey8qIEhFUk8gU0VDVElPTiAqL31cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwicmVsYXRpdmUgaC1bNDB2aF0gb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgPGltZ1xuICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE3ODU4ODgwNDEtYWYzZWYyODViNDcwP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9MTkyMCZxPTEwMFwiXG4gICAgICAgICAgICBhbHQ9XCJUcmF2ZWwgSGVyb1wiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciBzY2FsZS0xMDUgYmx1ci1bMnB4XVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctd2hpdGUvNzBcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0wIGxlZnQtMCByaWdodC0wIGgtMTIgYmctd2hpdGVcIj48L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCBoLWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1jZW50ZXIgdGV4dC13aGl0ZSBweC00XCI+XG4gICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC00eGwgbWQ6dGV4dC01eGwgZm9udC1ib2xkIGRyb3Atc2hhZG93LW1kXCI+XG4gICAgICAgICAgICAgIEV4cGxvcmUgRHJlYW0gUGFja2FnZXNcbiAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0yIHRleHQtYmFzZSBtZDp0ZXh0LWxnIHRleHQtd2hpdGUvOTBcIj5cbiAgICAgICAgICAgICAgRGlzY292ZXIgaGFuZHBpY2tlZCB0cmF2ZWwgZXhwZXJpZW5jZXMgY3JhZnRlZCBqdXN0IGZvciB5b3VcbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG5cbiAgICAgICAgey8qIEJFU1QgT0ZGRVJTIFNFQ1RJT04gKi99XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInB5LTE2IHB4LTQgYmctd2hpdGUgcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy03eGwgbXgtYXV0b1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBtYi0xMlwiPlxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC00eGwgZm9udC1ib2xkIHRleHQtZ3JheS05MDAgbWItM1wiPkJlc3QgT2ZmZXJzPC9oMj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1sZyB0ZXh0LWdyYXktNjAwXCI+RXhjbHVzaXZlIGRlYWxzIHlvdSB3b24ndCBmaW5kIGVsc2V3aGVyZTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTQgZ2FwLTZcIj5cbiAgICAgICAgICAgICAge2RvbWVzdGljUGFja2FnZXMubWFwKChwa2cpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBrZXk9e3BrZy5pZH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdyb3VwIGJnLXdoaXRlIHJvdW5kZWQtMnhsIHNoYWRvdy1sZyBob3ZlcjpzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgaG92ZXI6LXRyYW5zbGF0ZS15LTEgYm9yZGVyIGJvcmRlci1ibHVlLTEwMFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLTU2IG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXtwa2cuaW1hZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgYWx0PXtwa2cudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgZ3JvdXAtaG92ZXI6c2NhbGUtMTEwIHRyYW5zaXRpb24tdHJhbnNmb3JtIGR1cmF0aW9uLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgb25FcnJvcj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnNyYyA9IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDc1MjU0MjgwMzQtYjcyM2NmOTYxZDNlP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIjtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tdCBmcm9tLWJsYWNrLzMwIHRvLXRyYW5zcGFyZW50IG9wYWNpdHktMCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tMzAwXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LWJsdWUtNjAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlXCI+e3BrZy50eXBlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMSBiZy15ZWxsb3ctNTAgcHgtMiBweS0xIHJvdW5kZWQtZnVsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFN0YXIgY2xhc3NOYW1lPVwiaC0zIHctMyBmaWxsLXllbGxvdy00MDAgdGV4dC15ZWxsb3ctNDAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtZ3JheS05MDBcIj57cGtnLnJhdGluZ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS00MDBcIj4oe3BrZy5yZXZpZXdzfSk8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1ncmF5LTkwMCB0ZXh0LWJhc2UgbWItMiBsaW5lLWNsYW1wLTIgZ3JvdXAtaG92ZXI6dGV4dC1ibHVlLTYwMCB0cmFuc2l0aW9uLWNvbG9yc1wiPlxuICAgICAgICAgICAgICAgICAgICAgIHtwa2cudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIDwvaDM+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTEgdGV4dC1zbSB0ZXh0LWdyYXktNTAwIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8TWFwUGluIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntwa2cubG9jYXRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMSB0ZXh0LXNtIHRleHQtZ3JheS00MDAgbWItNFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxDbG9jayBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57cGtnLmR1cmF0aW9ufTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHQtMyBib3JkZXItdCBib3JkZXItZ3JheS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwIGxpbmUtdGhyb3VnaFwiPuKCuXtwa2cub3JpZ2luYWxQcmljZS50b0xvY2FsZVN0cmluZygpfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1iYXNlbGluZSBzcGFjZS14LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEluZGlhblJ1cGVlIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC1ibHVlLTYwMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWJsdWUtNjAwXCI+e3BrZy5wcmljZS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwXCI+cGVyIHBlcnNvbjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVQYWNrYWdlQm9vayhwa2cpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNiBweS0yLjUgYmctZ3JhZGllbnQtdG8tciBmcm9tLWJsdWUtNjAwIHRvLXB1cnBsZS02MDAgaG92ZXI6ZnJvbS1ibHVlLTcwMCBob3Zlcjp0by1wdXJwbGUtNzAwIHRleHQtd2hpdGUgZm9udC1zZW1pYm9sZCByb3VuZGVkLXhsIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMCBob3ZlcjpzaGFkb3ctbGcgdHJhbnNmb3JtIGhvdmVyOnNjYWxlLTEwNSBmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTJcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkJvb2sgTm93PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFycm93UmlnaHQgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICB7LyogQUxMIFBBQ0tBR0VTIFNFQ1RJT04gKi99XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInB5LTIwIHB4LTQgYmctZ3JheS01MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG9cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItMTJcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtNHhsIGZvbnQtYm9sZCB0ZXh0LWdyYXktOTAwIG1iLTNcIj5BbGwgUGFja2FnZXM8L2gyPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWxnIHRleHQtZ3JheS02MDBcIj5DdXJhdGVkIGV4cGVyaWVuY2VzIGZvciBldmVyeSB0eXBlIG9mIHRyYXZlbGVyPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBsZzpncmlkLWNvbHMtMyB4bDpncmlkLWNvbHMtNCBnYXAtNlwiPlxuICAgICAgICAgICAgICB7cGFja2FnZXMubWFwKChwa2cpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBrZXk9e3BrZy5pZH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdyb3VwIGJnLXdoaXRlIHJvdW5kZWQtMnhsIHNoYWRvdy1tZCBob3ZlcjpzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgaG92ZXI6LXRyYW5zbGF0ZS15LTEgYm9yZGVyIGJvcmRlci1ncmF5LTEwMFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLTUyIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXtwa2cuaW1hZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgYWx0PXtwa2cudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgZ3JvdXAtaG92ZXI6c2NhbGUtMTA1IHRyYW5zaXRpb24tdHJhbnNmb3JtIGR1cmF0aW9uLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgb25FcnJvcj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnNyYyA9IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDc1MjU0MjgwMzQtYjcyM2NmOTYxZDNlP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9ODAwJnE9ODBcIjtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMyBiZy1ncmFkaWVudC10by1yIGZyb20tYmx1ZS02MDAgdG8tcHVycGxlLTYwMCB0ZXh0LXdoaXRlIHB4LTMgcHktMSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1zZW1pYm9sZCBzaGFkb3ctbWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7cGtnLnR5cGV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIHJpZ2h0LTMgYmctd2hpdGUvOTUgYmFja2Ryb3AtYmx1ciBweC0yLjUgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdGV4dC1ncmF5LTkwMCBzaGFkb3ctc20gZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPFN0YXIgY2xhc3NOYW1lPVwiaC0zIHctMyBmaWxsLXllbGxvdy00MDAgdGV4dC15ZWxsb3ctNDAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57cGtnLnJhdGluZ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC01XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1ncmF5LTkwMCB0ZXh0LWJhc2UgbWItMiBsaW5lLWNsYW1wLTIgZ3JvdXAtaG92ZXI6dGV4dC1ibHVlLTYwMCB0cmFuc2l0aW9uLWNvbG9ycyBsZWFkaW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAge3BrZy50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPC9oMz5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMSB0ZXh0LXNtIHRleHQtZ3JheS01MDAgbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxNYXBQaW4gY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3BrZy5sb2NhdGlvbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0xIHRleHQtc20gdGV4dC1ncmF5LTQwMCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPENsb2NrIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntwa2cuZHVyYXRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGdhcC0yIG1iLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7cGtnLmhpZ2hsaWdodHMuc2xpY2UoMCwgMykubWFwKChoaWdobGlnaHQsIGlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpZHh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0xIGJnLWdyYWRpZW50LXRvLXIgZnJvbS1ibHVlLTUwIHRvLXB1cnBsZS01MCB0ZXh0LWJsdWUtNzAwIHRleHQteHMgcm91bmRlZC1tZCBmb250LW1lZGl1bVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtoaWdobGlnaHR9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB0LTMgYm9yZGVyLXQgYm9yZGVyLWdyYXktMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMCBsaW5lLXRocm91Z2hcIj7igrl7cGtnLm9yaWdpbmFsUHJpY2UudG9Mb2NhbGVTdHJpbmcoKX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtYmFzZWxpbmUgc3BhY2UteC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxJbmRpYW5SdXBlZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtZ3JheS00MDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtYm9sZCB0ZXh0LWdyYXktOTAwXCI+e3BrZy5wcmljZS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwXCI+cGVyIHBlcnNvbjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVQYWNrYWdlQm9vayhwa2cpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIGJnLWdyYWRpZW50LXRvLXIgZnJvbS1ibHVlLTYwMCB0by1wdXJwbGUtNjAwIGhvdmVyOmZyb20tYmx1ZS03MDAgaG92ZXI6dG8tcHVycGxlLTcwMCB0ZXh0LXdoaXRlIGZvbnQtc2VtaWJvbGQgcm91bmRlZC14bCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgaG92ZXI6c2hhZG93LWxnIHRyYW5zZm9ybSBob3ZlcjpzY2FsZS0xMDUgZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yXCJcbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5Cb29rIE5vdzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgey8qIEZFQVRVUkVTIFNFQ1RJT04gKi99XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInB5LTIwIHB4LTQgYmctd2hpdGUgcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWdyYWRpZW50LXRvLWJyIGZyb20tYmx1ZS01MC8zMCB2aWEtcHVycGxlLTUwLzIwIHRvLXBpbmstNTAvMzBcIj48L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0yMCBsZWZ0LTEwIHctNjQgaC02NCBiZy1ibHVlLTQwMC81IHJvdW5kZWQtZnVsbCBibHVyLTN4bFwiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTIwIHJpZ2h0LTEwIHctNjQgaC02NCBiZy1wdXJwbGUtNDAwLzUgcm91bmRlZC1mdWxsIGJsdXItM3hsXCI+PC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTd4bCBteC1hdXRvIHJlbGF0aXZlIHotMTBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItMTZcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtNHhsIGZvbnQtYm9sZCB0ZXh0LWdyYXktOTAwIG1iLTNcIj5XaHkgQ2hvb3NlIFRyYXZlbEJ1ZGR5PzwvaDI+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbGcgdGV4dC1ncmF5LTYwMCBtYXgtdy0zeGwgbXgtYXV0b1wiPlxuICAgICAgICAgICAgICAgIFdlIGdvIGFib3ZlIGFuZCBiZXlvbmQgdG8gbWFrZSB5b3VyIHRyYXZlbCBkcmVhbXMgY29tZSB0cnVlIHdpdGggcHJlbWl1bSBzZXJ2aWNlcyBhbmQgdW5mb3JnZXR0YWJsZSBleHBlcmllbmNlc1xuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGxnOmdyaWQtY29scy0zIGdhcC04XCI+XG4gICAgICAgICAgICAgIHtmZWF0dXJlcy5tYXAoKGZlYXR1cmUsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdyb3VwIGJnLXdoaXRlIHJvdW5kZWQtMnhsIHAtOCBzaGFkb3ctbGcgaG92ZXI6c2hhZG93LTJ4bCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgaG92ZXI6LXRyYW5zbGF0ZS15LTEgYm9yZGVyIGJvcmRlci1ncmF5LTEwMCB0ZXh0LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdy0xNiBoLTE2IGJnLWdyYWRpZW50LXRvLWJyIGZyb20tYmx1ZS01MDAgdG8tcHVycGxlLTYwMCByb3VuZGVkLTJ4bCBtYi02IGdyb3VwLWhvdmVyOnNjYWxlLTExMCB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0zMDAgc2hhZG93LWxnXCI+XG4gICAgICAgICAgICAgICAgICAgIDxmZWF0dXJlLmljb24gY2xhc3NOYW1lPVwiaC04IHctOCB0ZXh0LXdoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LWJvbGQgdGV4dC1ncmF5LTkwMCBtYi0zIGdyb3VwLWhvdmVyOnRleHQtYmx1ZS02MDAgdHJhbnNpdGlvbi1jb2xvcnNcIj5cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmUudGl0bGV9XG4gICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTYwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmUuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0wIGxlZnQtMCByaWdodC0wXCI+XG4gICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJ3LWZ1bGwgaC0yNFwiIHZpZXdCb3g9XCIwIDAgMTQ0MCAxMjBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiPlxuICAgICAgICAgICAgPHBhdGggZmlsbD1cImN1cnJlbnRDb2xvclwiIGZpbGxPcGFjaXR5PVwiMVwiIGNsYXNzTmFtZT1cInRleHQtZ3JheS01MFwiIGQ9XCJNMCw5Nkw0OCwxMTJDOTYsMTI4LDE5MiwxNjAsMjg4LDE4Ni43QzM4NCwyMTMsNDgwLDIzNSw1NzYsMjEzLjNDNjcyLDE5Miw3NjgsMTI4LDg2NCwxMjhDOTYwLDEyOCwxMDU2LDE5MiwxMTUyLDIwOEMxMjQ4LDIyNCwxMzQ0LDE5MiwxMzkyLDE3NkwxNDQwLDE2MEwxNDQwLDEyMEwxMzkyLDEyMEMxMzQ0LDEyMCwxMjQ4LDEyMCwxMTUyLDEyMEMxMDU2LDEyMCw5NjAsMTIwLDg2NCwxMjBDNzY4LDEyMCw2NzIsMTIwLDU3NiwxMjBDNDgwLDEyMCwzODQsMTIwLDI4OCwxMjBDMTkyLDEyMCw5NiwxMjAsNDgsMTIwTDAsMTIwWlwiPjwvcGF0aD5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIC8vIE5vdCBzdXBwb3J0ZWQgdHlwZXNcbiAgaWYgKHR5cGUgIT09ICdmbGlnaHRzJyAmJiB0eXBlICE9PSAndHJhaW5zJyAmJiB0eXBlICE9PSAnY2FicycpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctZ3JheS01MFwiPlxuICAgICAgICA8VG9wU2VhcmNoQmFyIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG8gcHgtNCBweS0yMCB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC1ncmF5LTkwMCBjYXBpdGFsaXplXCI+e3R5cGV9IFNlYXJjaDwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTYwMCBtdC0yXCI+VGhpcyBzZXJ2aWNlIHR5cGUgaXMgbm90IHlldCBzdXBwb3J0ZWQuPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICAvLyBNYWluIHJlc3VsdHMgcGFnZSAoR29vZ2xlIEZsaWdodHMgbGF5b3V0KVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWdyYXktNTBcIj5cbiAgICAgIHsvKiBTdGlja3kgVG9wIFNlYXJjaCBCYXIgKi99XG4gICAgICA8VG9wU2VhcmNoQmFyXG4gICAgICAgIGluaXRpYWxWYWx1ZXM9e3tcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgZGVzdGluYXRpb24sXG4gICAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgICByZXR1cm5EYXRlOiByZXR1cm5EYXRlUGFyYW0sXG4gICAgICAgICAgY2xhc3M6IHRyYXZlbENsYXNzLFxuICAgICAgICAgIHBhc3NlbmdlcnM6IHBhc3NlbmdlcnNcbiAgICAgICAgfX1cbiAgICAgIC8+XG5cbiAgICAgIHsvKiBCb29raW5nIFN0YXR1cyBBbGVydCAqL31cbiAgICAgIHtib29raW5nU3RhdHVzICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BtYXgtdy03eGwgbXgtYXV0byBweC00IG10LTIgJHtib29raW5nU3RhdHVzLnN1Y2Nlc3MgPyAnYmctZ3JlZW4tNTAgYm9yZGVyLWdyZWVuLTIwMCcgOiAnYmctcmVkLTUwIGJvcmRlci1yZWQtMjAwJ30gYm9yZGVyIHJvdW5kZWQtbGcgcC0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc21gfT5cbiAgICAgICAgICB7Ym9va2luZ1N0YXR1cy5zdWNjZXNzID9cbiAgICAgICAgICAgIDxDaGVja0NpcmNsZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtZ3JlZW4tNjAwXCIgLz4gOlxuICAgICAgICAgICAgPFhDaXJjbGUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXJlZC02MDBcIiAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2Jvb2tpbmdTdGF0dXMuc3VjY2VzcyA/ICd0ZXh0LWdyZWVuLTgwMCcgOiAndGV4dC1yZWQtODAwJ30+XG4gICAgICAgICAgICB7Ym9va2luZ1N0YXR1cy5tZXNzYWdlfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTd4bCBteC1hdXRvIHB4LTRcIj5cbiAgICAgICAgey8qIEVycm9yIE1lc3NhZ2VzICovfVxuICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMyBiZy1yZWQtNTAgYm9yZGVyIGJvcmRlci1yZWQtMjAwIHJvdW5kZWQtbGcgcC0zIGZsZXggaXRlbXMtc3RhcnQgZ2FwLTIgdGV4dC1zbVwiPlxuICAgICAgICAgICAgPFhDaXJjbGUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXJlZC02MDAgZmxleC1zaHJpbmstMCBtdC0wLjVcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yZWQtODAwXCI+e2Vycm9yfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7IWVycm9yICYmIHNvdXJjZSAmJiBkZXN0aW5hdGlvbiAmJiBzb3VyY2UgPT09IGRlc3RpbmF0aW9uICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTMgYmctYW1iZXItNTAgYm9yZGVyIGJvcmRlci1hbWJlci0yMDAgcm91bmRlZC1sZyBwLTMgZmxleCBpdGVtcy1zdGFydCBnYXAtMiB0ZXh0LXNtXCI+XG4gICAgICAgICAgICA8WENpcmNsZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtYW1iZXItNjAwIGZsZXgtc2hyaW5rLTAgbXQtMC41XCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtYW1iZXItODAwXCI+U291cmNlIGFuZCBkZXN0aW5hdGlvbiBjYW5ub3QgYmUgdGhlIHNhbWUuPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBIb3Jpem9udGFsIEZpbHRlciBCYXIgKi99XG4gICAgICAgIDxGaWx0ZXJCYXJcbiAgICAgICAgICBmbGlnaHRzPXtmaWx0ZXJlZEZsaWdodHN9XG4gICAgICAgICAgYWN0aXZlRmlsdGVycz17e319XG4gICAgICAgICAgb25GaWx0ZXJDaGFuZ2U9eygpID0+IHt9fVxuICAgICAgICAvPlxuXG4gICAgICAgIHsvKiBTb3J0IEJhciAtIG9ubHkgZm9yIGZsaWdodHMgKi99XG4gICAgICAgIHt0eXBlID09PSAnZmxpZ2h0cycgJiYgKFxuICAgICAgICAgIDxTb3J0QmFyXG4gICAgICAgICAgICBmbGlnaHRzPXtmaWx0ZXJlZEZsaWdodHN9XG4gICAgICAgICAgICBjdXJyZW50U29ydD17ZmxpZ2h0U29ydEJ5fVxuICAgICAgICAgICAgb25Tb3J0Q2hhbmdlPXtzZXRGbGlnaHRTb3J0Qnl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogUmVzdWx0cyBIZWFkZXIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMyBtYi00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTEuNSBiZy1ibHVlLTEwMCByb3VuZGVkLW1kXCI+XG4gICAgICAgICAgICAgIHt0eXBlID09PSAndHJhaW5zJyA/XG4gICAgICAgICAgICAgICAgPFRyYWluIGNsYXNzTmFtZT1cImgtNSB3LTUgdGV4dC1ibHVlLTYwMFwiIC8+IDpcbiAgICAgICAgICAgICAgICA8UGxhbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWJsdWUtNjAwXCIgLz5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJvbGQgdGV4dC1ncmF5LTkwMFwiPlxuICAgICAgICAgICAgICAgIHt0eXBlID09PSAnZmxpZ2h0cycgfHwgdHlwZSA9PT0gJ3RyYWlucycgPyBnZXRSb3V0ZVRpdGxlKCkgOiAnJ31cbiAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNjAwXCI+XG4gICAgICAgICAgICAgICAge3R5cGUgPT09ICd0cmFpbnMnID8gZmlsdGVyZWRUcmFpbnMubGVuZ3RoIDogZmlsdGVyZWRGbGlnaHRzLmxlbmd0aH0geycgJ31cbiAgICAgICAgICAgICAgICB7dHlwZSA9PT0gJ3RyYWlucycgPyAoZmlsdGVyZWRUcmFpbnMubGVuZ3RoID09PSAxID8gJ3RyYWluJyA6ICd0cmFpbnMnKSA6IChmaWx0ZXJlZEZsaWdodHMubGVuZ3RoID09PSAxID8gJ2ZsaWdodCcgOiAnZmxpZ2h0cycpfSBmb3VuZFxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHsvKiBNb2JpbGUgZmlsdGVyIGJ1dHRvbiBmb3IgdHJhaW5zIGFuZCBjYWJzICovfVxuICAgICAgICAgICAge3R5cGUgIT09ICdmbGlnaHRzJyAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc0ZpbHRlckRyYXdlck9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGc6aGlkZGVuIG1sLWF1dG8gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgcHgtMyBweS0xLjUgYmctd2hpdGUgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkIHRleHQtc20gdGV4dC1ncmF5LTcwMCBob3ZlcjpiZy1ncmF5LTUwXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxGaWx0ZXIgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgICAgRmlsdGVyc1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBNYWluIENvbnRlbnQgKi99XG4gICAgICAgIDxtYWluPlxuICAgICAgICAgIHt0eXBlID09PSAnZmxpZ2h0cycgPyAoXG4gICAgICAgICAgICA8RmxpZ2h0TGlzdFxuICAgICAgICAgICAgICBmbGlnaHRzPXtmaWx0ZXJlZEZsaWdodHN9XG4gICAgICAgICAgICAgIHNvcnRCeT17ZmxpZ2h0U29ydEJ5fVxuICAgICAgICAgICAgICBvblNvcnRDaGFuZ2U9e3NldEZsaWdodFNvcnRCeX1cbiAgICAgICAgICAgICAgb25Cb29rPXtoYW5kbGVCb29rfVxuICAgICAgICAgICAgICBvblZpZXdEZXRhaWxzPXtoYW5kbGVWaWV3RGV0YWlsc31cbiAgICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IHR5cGUgPT09ICd0cmFpbnMnID8gKFxuICAgICAgICAgICAgLy8gVHJhaW4gcmVzdWx0cyAoa2VlcCBleGlzdGluZyBVSSB3aXRoIGl0cyBvd24gc29ydCBkcm9wZG93bilcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTkwMFwiPntzb3J0ZWRUcmFpbnMubGVuZ3RofTwvc3Bhbj4gdHJhaW5zIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNjAwXCI+U29ydCBieTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dHJhaW5Tb3J0Qnl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0VHJhaW5Tb3J0QnkoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNtIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcm91bmRlZCBweC0yIHB5LTEuNSBiZy13aGl0ZSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDBcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVjb21tZW5kZWRcIj5SZWNvbW1lbmRlZDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicHJpY2VcIj5QcmljZTogTG93IHRvIEhpZ2g8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInByaWNlLWhpZ2hcIj5QcmljZTogSGlnaCB0byBMb3c8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRlcGFydHVyZVwiPkRlcGFydHVyZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZHVyYXRpb25cIj5EdXJhdGlvbjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHktMjBcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYW5pbWF0ZS1zcGluIHJvdW5kZWQtZnVsbCBoLTEyIHctMTIgYm9yZGVyLWItMiBib3JkZXItYmx1ZS02MDBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IHNvcnRlZFRyYWlucy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgcC0xMiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTE2IGgtMTYgYmctZ3JheS0xMDAgcm91bmRlZC1mdWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG14LWF1dG8gbWItNFwiPlxuICAgICAgICAgICAgICAgICAgICA8VHJhaW4gY2xhc3NOYW1lPVwiaC04IHctOCB0ZXh0LWdyYXktNDAwXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktOTAwIG1iLTJcIj5ObyB0cmFpbnMgZm91bmQ8L2gzPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNjAwIG1iLTRcIj5UcnkgYWRqdXN0aW5nIHlvdXIgc2VhcmNoIG9yIGZpbHRlcnM8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cbiAgICAgICAgICAgICAgICAgIHtzb3J0ZWRUcmFpbnMubWFwKCh0cmFpbikgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXt0cmFpbi5faWR9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctd2hpdGUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIHNoYWRvdy1zbSBob3ZlcjpzaGFkb3ctbWQgdHJhbnNpdGlvbi1hbGwgcC00IGZsZXggZmxleC1jb2wgbGc6ZmxleC1yb3cgaXRlbXMtc3RhcnQgbGc6aXRlbXMtY2VudGVyIGdhcC00XCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHsvKiBUcmFpbiBjYXJkIC0gc2FtZSBhcyBiZWZvcmUgKi99XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyB3LWZ1bGwgbGc6dy1hdXRvIGxnOm1pbi13LVsxODBweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMCBoLTEwIHJvdW5kZWQtbGcgYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1ibHVlLTUwMCB0by1pbmRpZ28tNjAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGZsZXgtc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFRyYWluIGNsYXNzTmFtZT1cImgtNSB3LTUgdGV4dC13aGl0ZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLXctMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktOTAwIHRydW5jYXRlXCI+e3RyYWluLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+e3RyYWluLnRyYWluTnVtYmVyfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBmbGV4IGZsZXgtY29sIHNtOmZsZXgtcm93IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTMgdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHNtOnRleHQtbGVmdCBtaW4tdy1bNjBweF1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZCB0ZXh0LWdyYXktOTAwXCI+e3RyYWluLmRlcGFydHVyZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS02MDAgZm9udC1tZWRpdW0gdHJ1bmNhdGVcIj57dHJhaW4uc291cmNlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgZ2FwLTEgZmxleC1zaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPnt0cmFpbi5kdXJhdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB3LTIwIHNtOnctMjggaC1weCBiZy1ncmF5LTMwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTEvMiBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzIgdy0yIGgtMiBiZy13aGl0ZSBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHJvdW5kZWQtZnVsbFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTYwMCBmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0cmFpbi5zdG9wc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBzbTp0ZXh0LWxlZnQgbWluLXctWzYwcHhdXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJvbGQgdGV4dC1ncmF5LTkwMFwiPnt0cmFpbi5hcnJpdmFsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTYwMCBmb250LW1lZGl1bSB0cnVuY2F0ZVwiPnt0cmFpbi5kZXN0aW5hdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdy1mdWxsIGxnOnctYXV0byBnYXAtNCBib3JkZXItdCBsZzpib3JkZXItdC0wIGxnOmJvcmRlci1sIGJvcmRlci1ncmF5LTEwMCBwdC0zIGxnOnB0LTAgbGc6cGwtNCBtdC0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtZXh0cmFib2xkIHRleHQtZ3JheS05MDBcIj7igrl7dHJhaW4ucHJpY2UudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+cGVyIHBlcnNvbjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUJvb2tUcmFpbih0cmFpbil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtc2hyaW5rLTAgYmctZ3JhZGllbnQtdG8tciBmcm9tLWJsdWUtNjAwIHRvLWJsdWUtNTAwIGhvdmVyOmZyb20tYmx1ZS03MDAgaG92ZXI6dG8tYmx1ZS02MDAgdGV4dC13aGl0ZSBweC01IHB5LTIgdGV4dC1zbSBmb250LXNlbWlib2xkIHJvdW5kZWQgc2hhZG93LXNtIGhvdmVyOnNoYWRvdyB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIEJvb2sgTm93XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiB0eXBlID09PSAnY2FicycgPyAoXG4gICAgICAgICAgICAvLyBDYWJzIHJlc3VsdHMgKGtlZXAgZXhpc3RpbmcpXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi00XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNjAwXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkIHRleHQtZ3JheS05MDBcIj57c29ydGVkQ2Ficy5sZW5ndGh9PC9zcGFuPiBjYWJzIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNjAwXCI+U29ydCBieTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2FiU29ydEJ5fVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENhYlNvcnRCeShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc20gYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkIHB4LTIgcHktMS41IGJnLXdoaXRlIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZWNvbW1lbmRlZFwiPlJlY29tbWVuZGVkPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwcmljZV9sb3dcIj5QcmljZTogTG93IHRvIEhpZ2g8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInByaWNlX2hpZ2hcIj5QcmljZTogSGlnaCB0byBMb3c8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJhdGluZ1wiPkhpZ2hlc3QgUmF0ZWQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7c29ydGVkQ2Ficy5sZW5ndGggPiAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBsZzpncmlkLWNvbHMtMyBnYXAtNlwiPlxuICAgICAgICAgICAgICAgICAge3NvcnRlZENhYnMubWFwKChjYWIsIGlkeCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtjYWIuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ3JvdXAgYmctd2hpdGUgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWdyYXktMTAwIHNoYWRvdy1zbSBob3ZlcjpzaGFkb3ctbGcgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwIG92ZXJmbG93LWhpZGRlblwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGgtNDAgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtdC14bFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e2NhYi5pbWFnZSB8fCBDQUJfSU1BR0VTW2lkeCAlIENBQl9JTUFHRVMubGVuZ3RoXX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0PXtjYWIubW9kZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgb2JqZWN0LWNvdmVyIGdyb3VwLWhvdmVyOnNjYWxlLTEwNSB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0Lm9uZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnNyYyA9IENBQl9JTUFHRVNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTMgYmctYmx1ZS02MDAgdGV4dC13aGl0ZSBweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LXhzIGZvbnQtc2VtaWJvbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2NhYi50eXBlfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Y2FiLnJhdGluZyA+PSA0LjUgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIHJpZ2h0LTMgYmctd2hpdGUvOTAgYmFja2Ryb3AtYmx1ciBweC0yIHB5LTEgcm91bmRlZC1tZCB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTkwMCBmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RhciBjbGFzc05hbWU9XCJoLTMgdy0zIGZpbGwteWVsbG93LTQwMCB0ZXh0LXllbGxvdy00MDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntjYWIucmF0aW5nfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC1ncmF5LTkwMCB0ZXh0LXNtIGxlYWRpbmctdGlnaHQgbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2FiLnR5cGV9IFJpZGUgLSB7Y2FiLm1vZGVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMCBtYi0zIGxpbmUtY2xhbXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7c291cmNlIHx8ICdQaWNrdXAnfSDihpIge2Rlc3RpbmF0aW9uIHx8ICdEcm9wJ30g4oCiIHtjYWIuZHVyYXRpb259IOKAoiB7Y2FiLmRlcGFydHVyZX0gLSB7Y2FiLmFycml2YWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Y2FiLnByaWNlID09PSBtaW5DYWJQcmljZSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1ibG9jayBweC0yIHB5LTAuNSBiZy1vcmFuZ2UtMTAwIHRleHQtb3JhbmdlLTcwMCB0ZXh0LVsxMHB4XSBmb250LXNlbWlib2xkIHJvdW5kZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJlc3QgUHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB0LTMgYm9yZGVyLXQgYm9yZGVyLWdyYXktMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbmRpYW5SdXBlZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtZ3JheS00MDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJvbGQgdGV4dC1ncmF5LTkwMFwiPntjYWIucHJpY2UudG9Mb2NhbGVTdHJpbmcoKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1ncmF5LTQwMFwiPm9uZS13YXkgZmFyZTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVCb29rQ2FiKGNhYil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIGJnLWdyYWRpZW50LXRvLXIgZnJvbS1ibHVlLTYwMCB0by1wdXJwbGUtNjAwIGhvdmVyOmZyb20tYmx1ZS03MDAgaG92ZXI6dG8tcHVycGxlLTcwMCB0ZXh0LXdoaXRlIHRleHQtc20gZm9udC1zZW1pYm9sZCByb3VuZGVkIHNoYWRvdy1zbSBob3ZlcjpzaGFkb3cgdHJhbnNpdGlvbi1hbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQk9PSyBOT1dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBzaGFkb3ctc20gcC0xMiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTUwMFwiPk5vIGNhYnMgbWF0Y2ggeW91ciBmaWx0ZXJzLiBUcnkgYWRqdXN0aW5nIHRoZW0uPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogTW9iaWxlIEZpbHRlciBEcmF3ZXIgKi99XG4gICAgICB7aXNGaWx0ZXJEcmF3ZXJPcGVuICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgbGc6aGlkZGVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWJsYWNrLzUwXCIgb25DbGljaz17KCkgPT4gc2V0SXNGaWx0ZXJEcmF3ZXJPcGVuKGZhbHNlKX0gLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LXktMCBsZWZ0LTAgdy1mdWxsIG1heC13LXhzIGJnLXdoaXRlIHNoYWRvdy14bCBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTQgYm9yZGVyLWJcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktOTAwXCI+RmlsdGVyczwvaDI+XG4gICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0SXNGaWx0ZXJEcmF3ZXJPcGVuKGZhbHNlKX0gY2xhc3NOYW1lPVwicC0yIHRleHQtZ3JheS01MDAgaG92ZXI6dGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgICAgICAgIOKclVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3cteS1hdXRvIHAtNFwiPlxuICAgICAgICAgICAgICB7dHlwZSA9PT0gJ2NhYnMnID8gKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi00XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktOTAwXCI+RmlsdGVyczwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlQ2FiUmVzZXR9IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ibHVlLTYwMCBob3Zlcjp0ZXh0LWJsdWUtNzAwIGZvbnQtbWVkaXVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgQ2xlYXIgQWxsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktNzAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlIG1iLTIuNVwiPkNhYiBUeXBlczwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAge1snRWNvbm9teScsICdTZWRhbicsICdTVVYnLCAnUHJlbWl1bScsICdBaXJwb3J0IFRyYW5zZmVyJywgJ091dHN0YXRpb24nXS5tYXAoKHR5cGUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e3R5cGV9IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGN1cnNvci1wb2ludGVyIGdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17Y2FiRmlsdGVycy5jYWJUeXBlcz8uaW5jbHVkZXModHlwZSkgfHwgZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IGhhbmRsZUNhYkNoZWNrYm94KCdjYWJUeXBlcycsIHR5cGUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctNCBoLTQgcm91bmRlZCBib3JkZXItZ3JheS0zMDAgdGV4dC1ibHVlLTYwMCBmb2N1czpyaW5nLWJsdWUtNTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LXNtIHRleHQtZ3JheS03MDAgZ3JvdXAtaG92ZXI6dGV4dC1ibHVlLTYwMFwiPnt0eXBlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktNzAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlIG1iLTIuNVwiPkRlcGFydHVyZSBUaW1lPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2Vhcmx5TW9ybmluZycsIGxhYmVsOiAnRWFybHkgTW9ybmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaWQ6ICdtb3JuaW5nJywgbGFiZWw6ICdNb3JuaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2FmdGVybm9vbicsIGxhYmVsOiAnQWZ0ZXJub29uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2V2ZW5pbmcnLCBsYWJlbDogJ0V2ZW5pbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnbmlnaHQnLCBsYWJlbDogJ05pZ2h0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKCh0aW1lKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXt0aW1lLmlkfSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBjdXJzb3ItcG9pbnRlciBncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NhYkZpbHRlcnMuZGVwYXJ0dXJlVGltZXM/LmluY2x1ZGVzKHRpbWUuaWQpIHx8IGZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBoYW5kbGVDYWJDaGVja2JveCgnZGVwYXJ0dXJlVGltZXMnLCB0aW1lLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTQgaC00IHJvdW5kZWQgYm9yZGVyLWdyYXktMzAwIHRleHQtYmx1ZS02MDAgZm9jdXM6cmluZy1ibHVlLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1zbSB0ZXh0LWdyYXktNzAwIGdyb3VwLWhvdmVyOnRleHQtYmx1ZS02MDBcIj57dGltZS5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi01XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTcwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZSBtYi0yLjVcIj5QcmljZSBSYW5nZTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIk1pblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjYWJGaWx0ZXJzLm1pblByaWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IGhhbmRsZUNhYlByaWNlQ2hhbmdlKCdtaW5QcmljZScsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTIgcHktMS41IHRleHQtc20gYm9yZGVyIGJvcmRlci1ncmF5LTMwMCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDAgdGV4dC1zbVwiPi08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJNYXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2FiRmlsdGVycy5tYXhQcmljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBoYW5kbGVDYWJQcmljZUNoYW5nZSgnbWF4UHJpY2UnLCBlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC0yIHB5LTEuNSB0ZXh0LXNtIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcm91bmRlZCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS01MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtZ3JheS03MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGUgbWItMi41XCI+U3RvcHM8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtbJ05vbi1zdG9wJywgJzEgU3RvcCcsICcyKyBTdG9wcyddLm1hcCgoc3RvcCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGtleT17c3RvcH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgY3Vyc29yLXBvaW50ZXIgZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtjYWJGaWx0ZXJzLnN0b3BzPy5pbmNsdWRlcyhzdG9wKSB8fCBmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gaGFuZGxlQ2FiQ2hlY2tib3goJ3N0b3BzJywgc3RvcCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy00IGgtNCByb3VuZGVkIGJvcmRlci1ncmF5LTMwMCB0ZXh0LWJsdWUtNjAwIGZvY3VzOnJpbmctYmx1ZS01MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtc20gdGV4dC1ncmF5LTcwMCBncm91cC1ob3Zlcjp0ZXh0LWJsdWUtNjAwXCI+e3N0b3B9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8RmlsdGVyc1xuICAgICAgICAgICAgICAgICAgZmlsdGVycz17ZmlsdGVyc31cbiAgICAgICAgICAgICAgICAgIG9uRmlsdGVyQ2hhbmdlPXsoY2F0ZWdvcnksIHZhbHVlKSA9PiBzZXRGaWx0ZXJzKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBbY2F0ZWdvcnldOiB2YWx1ZSB9KSl9XG4gICAgICAgICAgICAgICAgICBhdmFpbGFibGVBaXJsaW5lcz17dHlwZSA9PT0gJ3RyYWlucycgPyBUUkFJTl9UWVBFUyA6IFsnSW5kaWdvJywgJ0FpciBJbmRpYScsICdTcGljZUpldCcsICdWaXN0YXJhJywgJ0dvIEZpcnN0JywgJ0FrYXNhIEFpcicsICdBaXJBc2lhJ119XG4gICAgICAgICAgICAgICAgICBzZXJ2aWNlVHlwZT17dHlwZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBib3JkZXItdFwiPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNGaWx0ZXJEcmF3ZXJPcGVuKGZhbHNlKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctYmx1ZS02MDAgaG92ZXI6YmctYmx1ZS03MDAgdGV4dC13aGl0ZSBweS0yLjUgcm91bmRlZC1tZCBmb250LW1lZGl1bVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBBcHBseSBGaWx0ZXJzXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VhcmNoUmVzdWx0cztcbiJdfQ==