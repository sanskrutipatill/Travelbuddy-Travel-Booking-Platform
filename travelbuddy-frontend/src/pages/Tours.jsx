import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Star, ArrowRight } from 'lucide-react';
import { handleBooking } from '../utils/handleBooking';
import { AuthContext } from '../context/AuthContext';
import EditTourModal from '../components/EditTourModal';

const ToursPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const [editingTour, setEditingTour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setShowModal(true);
  };

  const [tours, setTours] = useState([
    {
      id: 1,
      title: 'Goa Beach & Nightlife Tour',
      location: 'Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 12500,
      rating: 4.7,
      highlights: ['Beach Parties', 'Water Sports', 'Cruise Dinner'],
      type: 'Adventure',
    },
    {
      id: 2,
      title: 'Kerala Backwaters Experience',
      location: 'Kerala',
      image: 'https://images.unsplash.com/photo-1590059843335-2c27e07112a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 18500,
      rating: 4.9,
      highlights: ['Houseboat Stay', 'Kathakali', 'Tea Gardens'],
      type: 'Leisure',
    },
    {
      id: 3,
      title: 'Rajasthan Desert Safari',
      location: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 22000,
      rating: 4.8,
      highlights: ['Camel Safari', 'Desert Camp', 'Folk Dance'],
      type: 'Cultural',
    },
    {
      id: 4,
      title: 'Himalayan Adventure',
      location: 'Manali',
      image: 'https://images.unsplash.com/photo-1605590423641-845885581e61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 28500,
      rating: 4.6,
      highlights: ['River Rafting', 'Paragliding', 'Snow Point'],
      type: 'Adventure',
    },
    {
      id: 5,
      title: 'Bali Spiritual Retreat',
      location: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 35000,
      rating: 4.9,
      highlights: ['Yoga', 'Temples', 'Beaches', 'Spa'],
      type: 'Wellness',
    },
    {
      id: 6,
      title: 'Thailand City Tour',
      location: 'Bangkok',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 17500,
      rating: 4.5,
      highlights: ['Temples', 'Floating Market', 'Street Food'],
      type: 'City Tour',
    },
    {
      id: 7,
      title: 'Leh Ladakh Motorcycle Expedition',
      location: 'Leh Ladakh',
      image: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '10 Days / 9 Nights',
      price: 45000,
      rating: 4.9,
      highlights: ['Royal Enfield', 'Khardung La', 'Pangong Lake'],
      type: 'Adventure',
    },
    {
      id: 8,
      title: 'Dubai Luxury Tour',
      location: 'Dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 72000,
      rating: 4.8,
      highlights: ['Burj Khalifa', 'Desert Safari', 'Dhow Cruise'],
      type: 'Luxury',
    },
    {
      id: 9,
      title: 'Varanasi Spiritual Journey',
      location: 'Varanasi',
      image: 'https://images.unsplash.com/photo-1526481280693-3a266a3b370d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 12500,
      rating: 4.6,
      highlights: ['Ganga Aarti', 'Boat Ride', 'Temples'],
      type: 'Pilgrimage',
    },
    {
      id: 10,
      title: 'Maldives Beach Paradise',
      location: 'Maldives',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 95000,
      rating: 4.9,
      highlights: ['Water Villas', 'Snorkeling', 'Sunset Cruise'],
      type: 'Beach',
    },
    {
      id: 11,
      title: 'Singapore Family Fun',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 42000,
      rating: 4.7,
      highlights: ['Sentosa Island', 'Universal Studios', 'Gardens by Bay'],
      type: 'Family',
    },
    {
      id: 12,
      title: 'Taj Mahal Heritage Tour',
      location: 'Agra',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 7500,
      rating: 4.8,
      highlights: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri'],
      type: 'Historical',
    },
    {
      id: 13,
      title: 'Swiss Alps Adventure',
      location: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 165000,
      rating: 4.9,
      highlights: ['Jungfrau', 'Glacier Express', 'Lucerne'],
      type: 'Adventure',
    },
    {
      id: 14,
      title: 'Hampi Historical Tour',
      location: 'Hampi',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 10500,
      rating: 4.5,
      highlights: ['Vijaya Vittala', 'Stone Chariot', 'Hampi Bazaar'],
      type: 'Historical',
    },
    {
      id: 15,
      title: 'Paris City of Light',
      location: 'Paris',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 115000,
      rating: 4.8,
      highlights: ['Eiffel Tower', 'Louvre', 'Seine Cruise'],
      type: 'City Tour',
    },
    {
      id: 16,
      title: 'Darjeeling Tea Gardens',
      location: 'Darjeeling',
      image: 'https://images.unsplash.com/photo-1587729927502-0656c9f75893?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 15500,
      rating: 4.6,
      highlights: ['Tea Estates', 'Tiger Hill', 'Toy Train'],
      type: 'Leisure',
    },
    {
      id: 17,
      title: 'Pondicherry French Heritage',
      location: 'Pondicherry',
      image: 'https://images.unsplash.com/photo-1580079904560-575833732d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 9500,
      rating: 4.4,
      highlights: ['French Quarter', 'Aurobindo Ashram', 'Beaches'],
      type: 'Cultural',
    },
    {
      id: 18,
      title: 'Tokyo Modern Tour',
      location: 'Tokyo',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 95000,
      rating: 4.7,
      highlights: ['Shibuya Crossing', 'Sensoji Temple', 'Mt. Fuji'],
      type: 'City Tour',
    },
    {
      id: 19,
      title: 'Shimla Hill Retreat',
      location: 'Shimla',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 14500,
      rating: 4.5,
      highlights: ['Mall Road', 'Jakhu Temple', 'Toy Train'],
      type: 'Leisure',
    },
    {
      id: 20,
      title: 'Egypt Pyramids Tour',
      location: 'Cairo',
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 75000,
      rating: 4.8,
      highlights: ['Pyramids of Giza', 'Sphinx', 'Nile Cruise'],
      type: 'Historical',
    },
    {
      id: 21,
      title: 'Ooty Hill Station',
      location: 'Ooty',
      image: 'https://images.unsplash.com/photo-1510627489934-2554c6dd80d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 11000,
      rating: 4.4,
      highlights: ['Botanical Gardens', 'Nilgiri Railway', 'Doddabetta Peak'],
      type: 'Leisure',
    },
    {
      id: 22,
      title: 'Barcelona Architecture',
      location: 'Barcelona',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 125000,
      rating: 4.8,
      highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla'],
      type: 'City Tour',
    },
    {
      id: 23,
      title: 'Jim Corbett Safari',
      location: 'Jim Corbett',
      image: 'https://images.unsplash.com/photo-1548021682-1720c315a2c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 16500,
      rating: 4.6,
      highlights: ['Jeep Safari', 'Tiger Spotting', 'Nature Walks'],
      type: 'Adventure',
    },
    {
      id: 24,
      title: 'Mysore Palace Tour',
      location: 'Mysore',
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '2 Days / 1 Night',
      price: 6500,
      rating: 4.5,
      highlights: ['Mysore Palace', 'Chamundi Hill', 'Brindavan Gardens'],
      type: 'Historical',
    },
    {
      id: 25,
      title: 'New Zealand Nature',
      location: 'New Zealand',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '10 Days / 9 Nights',
      price: 185000,
      rating: 4.9,
      highlights: ['Milford Sound', 'Rotorua', 'Queenstown'],
      type: 'Adventure',
    },
    {
      id: 26,
      title: 'Amritsar Golden Temple',
      location: 'Amritsar',
      image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 8500,
      rating: 4.7,
      highlights: ['Golden Temple', 'Wagah Border', 'Jallianwala Bagh'],
      type: 'Pilgrimage',
    },
    {
      id: 27,
      title: 'Italy Rome & Venice',
      location: 'Italy',
      image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 155000,
      rating: 4.8,
      highlights: ['Rome', 'Venice', 'Florence', 'Vatican'],
      type: 'Romantic',
    },
    {
      id: 28,
      title: 'Nainital Lake Tour',
      location: 'Nainital',
      image: 'https://images.unsplash.com/photo-1577504552078-6333861a3e75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 9800,
      rating: 4.4,
      highlights: ['Naini Lake', 'Naina Devi Temple', 'Snow View'],
      type: 'Leisure',
    },
    {
      id: 29,
      title: 'Chiang Mai Sanctuary',
      location: 'Chiang Mai',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 21500,
      rating: 4.7,
      highlights: ['Elephant Sanctuary', 'Temples', 'Night Safari'],
      type: 'Ethical',
    },
    {
      id: 30,
      title: 'Jaipur Pink City',
      location: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 13500,
      rating: 4.7,
      highlights: ['Hawa Mahal', 'Amer Fort', 'City Palace'],
      type: 'Cultural',
    },
    {
      id: 31,
      title: 'Jaisalmer Desert Camp',
      location: 'Jaisalmer',
      image: 'https://images.unsplash.com/photo-1508666902358-4a1c9770bb24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 12500,
      rating: 4.6,
      highlights: ['Thar Desert', 'Camel Safari', 'Jaisalmer Fort'],
      type: 'Adventure',
    },
    {
      id: 32,
      title: 'Coorg Coffee Estate',
      location: 'Coorg',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days / 2 Nights',
      price: 9800,
      rating: 4.5,
      highlights: ['Coffee Plantations', 'Waterfalls', 'Spice Gardens'],
      type: 'Leisure',
    },
    {
      id: 33,
      title: 'Bhutan Kingdom Tour',
      location: 'Bhutan',
      image: 'https://images.unsplash.com/photo-1539526243206-2d70aa36f936?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 42000,
      rating: 4.9,
      highlights: ["Tiger's Nest", 'Thimphu', 'Punakha Dzong'],
      type: 'Cultural',
    },
    {
      id: 34,
      title: 'Sikkim Gangtok Tour',
      location: 'Sikkim',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 22500,
      rating: 4.6,
      highlights: ['Tsomgo Lake', 'Rumtek Monastery', 'MG Marg'],
      type: 'Leisure',
    },
    {
      id: 35,
      title: 'Iceland Northern Lights',
      location: 'Iceland',
      image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
      duration: '8 Days / 7 Nights',
      price: 195000,
      rating: 4.9,
      highlights: ['Northern Lights', 'Blue Lagoon', 'Glacier Hiking'],
      type: 'Adventure',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tours & Attractions</h1>
          <p className="text-gray-500 text-sm mt-1">Curated experiences and guided tours</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group">

              {/* Edit Icon for Admin */}
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTour(tour);
                  }}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
                >
                  ✏️
                </button>
              )}

              {/* Image with fallback */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                  {tour.type}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{tour.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {tour.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                  {tour.location}
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                  {tour.duration}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.slice(0, 3).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-md"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Per person</p>
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="h-4 w-4 text-gray-400" />
                      <span className="text-xl font-bold text-gray-900">{tour.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBooking(navigate, 'tour', tour)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">No tours available.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditTourModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingTour(null); }}
        tour={editingTour}
        onSave={(updatedTour) => {
          setTours(prev => prev.map(t => {
            const currentId = t._id || t.id;
            const updatedId = updatedTour._id || updatedTour.id;
            return (currentId === updatedId && currentId) ? updatedTour : t;
          }));
          setShowModal(false);
          setEditingTour(null);
        }}
      />
    </div>
  );
};

export default ToursPage;
