import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Car, Calendar, Star, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { handleBooking } from '../utils/handleBooking';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminEditButton from '../components/AdminEditButton';
import EditServiceModal from '../components/EditServiceModal';
import AdminAddButton from '../components/AdminAddButton';

// placeholder images for cabs
const CAB_IMAGES = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58af?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
];

const CabsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const [editingCab, setEditingCab] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (cab) => {
    setEditingCab(cab);
    setShowEditModal(true);
  };

  const pickup = searchParams.get('source') || '';
  const drop = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

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
    },
  ];

  // Filter state
  const [filters, setFilters] = useState({
    cabTypes: [],
    minPrice: '',
    maxPrice: '',
    departureTimes: [],
    stops: [],
  });

  const [sortBy, setSortBy] = useState('recommended');

  // Filter handlers
  const handleCheckbox = (category, value) => {
    const current = filters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters((prev) => ({ ...prev, [category]: updated }));
  };

  const handlePriceChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleReset = () => {
    setFilters({
      cabTypes: [],
      minPrice: '',
      maxPrice: '',
      departureTimes: [],
      stops: [],
    });
  };

  // Time bucket mapping
  const getTimeBucket = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 0 && hour < 6) return 'earlyMorning';
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  };

  // Apply filters & sorting
  const filteredCabs = useMemo(() => {
    let result = [...cabs];

    // Cab Types filter
    if (filters.cabTypes.length > 0) {
      result = result.filter((cab) => filters.cabTypes.includes(cab.type));
    }

    // Price range filter
    if (filters.minPrice) {
      result = result.filter((cab) => cab.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((cab) => cab.price <= parseInt(filters.maxPrice));
    }

    // Departure Time filter
    if (filters.departureTimes.length > 0) {
      result = result.filter((cab) => {
        const bucket = getTimeBucket(cab.departure);
        return filters.departureTimes.includes(bucket);
      });
    }

    // Stops filter (dummy - no effect as cabs have no stops property)
    // Kept for UI completeness

    return result;
  }, [cabs, filters]);

  // Sorting
  const sortedCabs = useMemo(() => {
    const sorted = [...filteredCabs];
    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredCabs, sortBy]);

  // Find best price indicator (lowest price among filtered)
  const minPrice = filteredCabs.length > 0 ? Math.min(...filteredCabs.map((c) => c.price)) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{pickup || 'City Center'}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{drop || 'Airport'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{date || 'Select date'}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Modify Search
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Filter Sidebar */}
          <aside className="w-1/4 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-[88px] h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={handleReset}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Cab Types */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Cab Types</h3>
                <div className="space-y-2">
                  {['Economy', 'Sedan', 'SUV', 'Premium', 'Airport Transfer', 'Outstation'].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.cabTypes?.includes(type) || false}
                        onChange={() => handleCheckbox('cabTypes', type)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Departure Time */}
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
                        checked={filters.departureTimes?.includes(time.id) || false}
                        onChange={() => handleCheckbox('departureTimes', time.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Price Range</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Stops (dummy for UI) */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Stops</h3>
                <div className="space-y-2">
                  {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
                    <label key={stop} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.stops?.includes(stop) || false}
                        onChange={() => handleCheckbox('stops', stop)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{stop}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
              <div className="text-sm text-gray-600 flex items-center gap-3">
                <span><span className="font-semibold text-gray-900">{sortedCabs.length}</span> cabs available</span>
                {user?.role?.toLowerCase() === 'admin' && (
                  <AdminAddButton label="Add Cab" onClick={() => { setEditingCab(null); setShowEditModal(true); }} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Cab Cards Grid */}
            {sortedCabs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCabs.map((cab, idx) => (
                  <div
                    key={cab.id}
                    className="relative group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {user?.role?.toLowerCase() === 'admin' && (
                      <AdminEditButton onClick={() => handleEdit(cab)} />
                    )}
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden rounded-t-xl">
                      <img
                        src={CAB_IMAGES[idx % CAB_IMAGES.length]}
                        alt={cab.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CAB_IMAGES[0];
                        }}
                      />
                      {/* Type badge */}
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                        {cab.type}
                      </div>
                      {/* Rating badge */}
                      {cab.rating >= 4.5 && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-gray-900 flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{cab.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                        {cab.type} Ride - {cab.model}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {pickup || 'Pickup'} → {drop || 'Drop'} • {cab.duration} • {cab.departure} - {cab.arrival}
                      </p>

                      {/* Offer tag (optional) */}
                      {cab.price === minPrice && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded">
                            Best Price
                          </span>
                        </div>
                      )}

                      {/* Price & Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="h-4 w-4 text-gray-400" />
                            <span className="text-lg font-bold text-gray-900">{cab.price.toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">one-way fare</p>
                        </div>
                        <button
                          onClick={() => handleBooking(navigate, 'cab', cab)}
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
          </main>
        </div>
      </div>

      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        serviceType="cab"
        item={editingCab}
        onSave={(updatedCab) => {
          // Local update if needed
          setShowEditModal(false);
          setEditingCab(null);
        }}
      />
    </div>
  );
};

export default CabsPage;
