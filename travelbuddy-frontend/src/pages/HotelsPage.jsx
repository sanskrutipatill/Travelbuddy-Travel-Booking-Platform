import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, MapPin, Star, ChevronDown, X } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import HotelFilters from '../components/HotelFilters';
import { AuthContext } from '../context/AuthContext';
import { handleBooking } from '../utils/handleBooking';
import AdminEditButton from '../components/AdminEditButton';
import EditServiceModal from '../components/EditServiceModal';
import AdminAddButton from '../components/AdminAddButton';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'reviews_desc', label: 'Most Reviewed' },
];

const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // State
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [editingHotel, setEditingHotel] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setShowEditModal(true);
  };

  // Get search params
  const locationQuery = searchParams.get('location')?.trim() || '';
  const checkIn = searchParams.get('date') || '';
  const guests = searchParams.get('guests') || '2';

  // Filters state
  const [filters, setFilters] = useState({
    location: locationQuery,
    minPrice: '',
    maxPrice: '',
    rating: [],
    amenities: [],
    propertyTypes: [],
  });

  // Fetch hotels on mount and when location changes
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query params
        const params = {};
        if (filters.location) params.location = filters.location;

        console.log('Fetching hotels with params:', params);

        const response = await axios.get('http://localhost:5000/api/hotels', {
          params,
        });

        console.log(`Fetched ${response.data.length} hotels`);
        setHotels(response.data);

        // Extract unique locations for autocomplete
        const locations = [...new Set(response.data.map(h => h.location))].sort();
        setAvailableLocations(locations);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.response?.data?.message || 'Failed to load hotels');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [filters.location]); // Re-fetch when location filter changes

  // Apply filters & sorting
  useEffect(() => {
    let result = [...hotels];

    // Price filter
    if (filters.minPrice) {
      result = result.filter(h => h.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(h => h.price <= parseInt(filters.maxPrice));
    }

    // Rating filter
    if (filters.rating.length > 0) {
      result = result.filter(h =>
        filters.rating.some(r => h.rating >= r)
      );
    }

    // Property type filter
    if (filters.propertyTypes.length > 0) {
      result = result.filter(h =>
        filters.propertyTypes.includes(h.propertyType)
      );
    }

    // Amenities filter (all selected amenities must be present)
    if (filters.amenities.length > 0) {
      result = result.filter(h =>
        filters.amenities.every(a => h.amenities?.includes(a))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews_desc':
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default: // recommended - keep natural order or could add popularity score
        break;
    }

    setFilteredHotels(result);
  }, [hotels, filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (category, value) => {
    if (Array.isArray(filters[category])) {
      // Toggle array item
      setFilters(prev => {
        const current = prev[category];
        if (current.includes(value)) {
          return { ...prev, [category]: current.filter(v => v !== value) };
        } else {
          return { ...prev, [category]: [...current, value] };
        }
      });
    } else {
      setFilters(prev => ({ ...prev, [category]: value }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      location: locationQuery,
      minPrice: '',
      maxPrice: '',
      rating: [],
      amenities: [],
      propertyTypes: [],
    });
  };

  const handleBook = (hotel) => {
    if (!user) {
      alert('Please login to book a hotel');
      navigate('/login');
      return;
    }
    // Normalize hotel data to ensure required fields
    const normalizedHotel = {
      ...hotel,
      name: hotel.name || hotel.title || 'Hotel',
      location: hotel.location || hotel.city || 'Unknown Location',
      price: hotel.price || 0,
    };
    const hotelWithDetails = {
      ...normalizedHotel,
      checkIn,
      guests,
    };
    console.log('Booking hotel:', hotelWithDetails);
    handleBooking(navigate, 'hotel', hotelWithDetails);
  };

  const handleViewDetails = (hotel) => {
    // Could navigate to a detail page or show modal
    alert(`Hotel: ${hotel.name}\nLocation: ${hotel.location}\nRating: ${hotel.rating}\nPrice: ₹${hotel.price}/night\nAmenities: ${hotel.amenities?.join(', ')}`);
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((count, val) => {
    if (Array.isArray(val)) return count + val.length;
    if (val) return count + 1;
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Matching Packages Results Page */}
      <section className="relative h-[40vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920&q=100"
          alt="Hotels Hero"
          className="absolute w-full h-full object-cover scale-105 blur-[2px]"
        />
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md mb-2 flex items-center justify-center gap-3 w-full">
            Explore Hotels
            {user?.role === 'admin' && (
              <AdminAddButton label="Add Hotel" onClick={() => { setEditingHotel(null); setShowEditModal(true); }} />
            )}
          </h1>
          <p className="mt-2 text-base md:text-lg text-white/90">
            Find the perfect stay for your trip
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Summary Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {filters.location || 'All Locations'}
                </span>
              </div>
              {checkIn && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Check-in: {checkIn}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{guests} Guest{guests > 1 ? 's' : ''}</span>
              </div>
              <div className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredHotels.length}</span> properties
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="hidden lg:block w-full lg:w-72 flex-shrink-0">
            <HotelFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              availableLocations={availableLocations}
            />
          </aside>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <HotelFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    availableLocations={availableLocations}
                  />
                </div>
                <div className="p-4 border-t">
                  <button
                    onClick={() => {
                      setShowMobileFilters(false);
                      if (activeFilterCount > 0) {
                        // Apply filters (they're already applied via state)
                      }
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                  >
                    Show {filteredHotels.length} results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Hotel Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl border border-red-200 p-12 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Hotels</h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search for a different location to find available hotels.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel._id || hotel.id}
                    className="relative cursor-pointer"
                    onClick={() => navigate(`/hotel-details?guests=${guests}`, { state: { hotel } })}
                  >
                    {user?.role === 'admin' && (
                      <AdminEditButton onClick={() => handleEdit(hotel)} />
                    )}
                    <HotelCard
                      hotel={hotel}
                      onBook={handleBook}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More (optional) */}
            {filteredHotels.length > 0 && filteredHotels.length < hotels.length && (
              <div className="mt-12 text-center">
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                  Load More Hotels
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        serviceType="hotel"
        item={editingHotel}
        onSave={(updatedHotel) => {
          setHotels(prev => prev.map(h => (h._id === updatedHotel._id || h.id === updatedHotel.id) ? updatedHotel : h));
          setShowEditModal(false);
          setEditingHotel(null);
        }}
      />
    </div>
  );
};

export default HotelsPage;
