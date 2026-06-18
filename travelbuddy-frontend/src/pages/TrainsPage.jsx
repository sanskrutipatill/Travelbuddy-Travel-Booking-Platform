import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Train, MapPin, Clock, IndianRupee, ArrowRight, Filter } from 'lucide-react';
import { handleBooking } from '../utils/handleBooking';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminEditButton from '../components/AdminEditButton';
import EditServiceModal from '../components/EditServiceModal';
import AdminAddButton from '../components/AdminAddButton';

const TrainsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchFrom = searchParams.get('source') || '';
  const searchTo = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const [sortBy, setSortBy] = useState('price');
  
  const { user } = useContext(AuthContext);
  const [editingTrain, setEditingTrain] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (train) => {
    setEditingTrain(train);
    setShowEditModal(true);
  };

  // Comprehensive train dataset (30 trains across multiple routes) - memoized
  const allTrains = useMemo(() => [
    // Delhi → Mumbai (6 trains)
    {
      _id: 1,
      trainName: 'Rajdhani Express',
      trainNumber: '12951',
      source: 'Delhi',
      destination: 'Mumbai',
      departure: '16:25',
      arrival: '08:35',
      duration: '16h 10m',
      price: 3200,
      stops: 'Non-stop',
      type: 'Rajdhani',
      class: '3AC',
      rating: 4.7,
    },
    {
      _id: 2,
      trainName: 'Duronto Express',
      trainNumber: '12921',
      source: 'Delhi',
      destination: 'Mumbai',
      departure: '22:50',
      arrival: '12:25',
      duration: '13h 35m',
      price: 2800,
      stops: 'Non-stop',
      type: 'Superfast',
      class: 'Sleeper',
      rating: 4.5,
    },
    {
      _id: 3,
      trainName: 'Shatabdi Express',
      trainNumber: '12001',
      source: 'Delhi',
      destination: 'Mumbai',
      departure: '06:00',
      arrival: '12:30',
      duration: '6h 30m',
      price: 1200,
      stops: 'Non-stop',
      type: 'Shatabdi',
      class: 'Executive',
      rating: 4.4,
    },
    {
      _id: 4,
      trainName: 'Garib Rath',
      trainNumber: '12201',
      source: 'Delhi',
      destination: 'Mumbai',
      departure: '18:15',
      arrival: '10:45',
      duration: '16h 30m',
      price: 1800,
      stops: 'Non-stop',
      type: 'Express',
      class: '3AC',
      rating: 4.1,
    },
    {
      _id: 5,
      trainName: 'Jan Shatabdi',
      trainNumber: '12057',
      source: 'Delhi',
      destination: 'Mumbai',
      departure: '14:30',
      arrival: '20:45',
      duration: '6h 15m',
      price: 650,
      stops: '1 Stop',
      type: 'Shatabdi',
      class: 'AC Chair',
      rating: 4.0,
    },
    {
      _id: 6,
      trainName: 'Avantika Express',
      trainNumber: '12961',
      source: 'Delhi',
      destination: 'Mumbai',
      departure: '20:00',
      arrival: '09:30',
      duration: '13h 30m',
      price: 2200,
      stops: '2+ Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.3,
    },

    // Mumbai → Delhi (5 trains)
    {
      _id: 7,
      trainName: 'Mumbai Rajdhani',
      trainNumber: '12953',
      source: 'Mumbai',
      destination: 'Delhi',
      departure: '16:00',
      arrival: '08:30',
      duration: '16h 30m',
      price: 3400,
      stops: 'Non-stop',
      type: 'Rajdhani',
      class: '3AC',
      rating: 4.8,
    },
    {
      _id: 8,
      trainName: 'Duronto Express',
      trainNumber: '22221',
      source: 'Mumbai',
      destination: 'Delhi',
      departure: '11:00',
      arrival: '03:30',
      duration: '16h 30m',
      price: 2900,
      stops: 'Non-stop',
      type: 'Superfast',
      class: 'Sleeper',
      rating: 4.6,
    },
    {
      _id: 9,
      trainName: 'Swaraj Express',
      trainNumber: '12431',
      source: 'Mumbai',
      destination: 'Delhi',
      departure: '07:30',
      arrival: '22:45',
      duration: '15h 15m',
      price: 2500,
      stops: '2+ Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.4,
    },
    {
      _id: 10,
      trainName: 'Kokan Kanya',
      trainNumber: '11011',
      source: 'Mumbai',
      destination: 'Delhi',
      departure: '22:00',
      arrival: '12:30',
      duration: '14h 30m',
      price: 1600,
      stops: '1 Stop',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.0,
    },
    {
      _id: 11,
      trainName: 'Pune Delhi Express',
      trainNumber: '12137',
      source: 'Mumbai',
      destination: 'Delhi',
      departure: '00:30',
      arrival: '16:45',
      duration: '16h 15m',
      price: 2100,
      stops: '2+ Stops',
      type: 'Express',
      class: '3AC',
      rating: 4.2,
    },

    // Chennai → Bangalore (5 trains)
    {
      _id: 12,
      trainName: 'Chennai Express',
      trainNumber: '12652',
      source: 'Chennai',
      destination: 'Bangalore',
      departure: '07:15',
      arrival: '14:00',
      duration: '6h 45m',
      price: 1200,
      stops: '4 Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.3,
    },
    {
      _id: 13,
      trainName: 'Lal Bagh Express',
      trainNumber: '12638',
      source: 'Chennai',
      destination: 'Bangalore',
      departure: '06:00',
      arrival: '13:30',
      duration: '7h 30m',
      price: 1100,
      stops: '5 Stops',
      type: 'Superfast',
      class: 'AC Chair',
      rating: 4.2,
    },
    {
      _id: 14,
      trainName: 'Brindavan Express',
      trainNumber: '12639',
      source: 'Chennai',
      destination: 'Bangalore',
      departure: '14:30',
      arrival: '21:45',
      duration: '7h 15m',
      price: 1050,
      stops: '4 Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.1,
    },
    {
      _id: 15,
      trainName: 'Mysore Express',
      trainNumber: '12672',
      source: 'Chennai',
      destination: 'Bangalore',
      departure: '20:00',
      arrival: '03:30',
      duration: '7h 30m',
      price: 900,
      stops: '3 Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.0,
    },
    {
      _id: 16,
      trainName: 'Kaveri Express',
      trainNumber: '16022',
      source: 'Chennai',
      destination: 'Bangalore',
      departure: '22:30',
      arrival: '06:00',
      duration: '7h 30m',
      price: 850,
      stops: '2 Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 3.9,
    },

    // Bangalore → Hyderabad (5 trains)
    {
      _id: 17,
      trainName: 'Kacheguda Express',
      trainNumber: '12735',
      source: 'Bangalore',
      destination: 'Hyderabad',
      departure: '06:30',
      arrival: '14:30',
      duration: '8h 00m',
      price: 1100,
      stops: '3 Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.4,
    },
    {
      _id: 18,
      trainName: 'Rajdhani Express',
      trainNumber: '12433',
      source: 'Bangalore',
      destination: 'Hyderabad',
      departure: '10:00',
      arrival: '17:50',
      duration: '7h 50m',
      price: 2200,
      stops: 'Non-stop',
      type: 'Rajdhani',
      class: '3AC',
      rating: 4.8,
    },
    {
      _id: 19,
      trainName: 'Humsafar Express',
      trainNumber: '12731',
      source: 'Bangalore',
      destination: 'Hyderabad',
      departure: '14:45',
      arrival: '22:45',
      duration: '8h 00m',
      price: 1400,
      stops: '2 Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.5,
    },
    {
      _id: 20,
      trainName: 'Vivek Express',
      trainNumber: '22851',
      source: 'Bangalore',
      destination: 'Hyderabad',
      departure: '18:30',
      arrival: '02:30',
      duration: '8h 00m',
      price: 1300,
      stops: '1 Stop',
      type: 'Superfast',
      class: 'Sleeper',
      rating: 4.3,
    },
    {
      _id: 21,
      trainName: 'Charminar Express',
      trainNumber: '17652',
      source: 'Bangalore',
      destination: 'Hyderabad',
      departure: '21:00',
      arrival: '05:30',
      duration: '8h 30m',
      price: 950,
      stops: '4 Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.1,
    },

    // Kolkata → Delhi (4 trains)
    {
      _id: 22,
      trainName: 'Sealdah Rajdhani',
      trainNumber: '12314',
      source: 'Kolkata',
      destination: 'Delhi',
      departure: '16:50',
      arrival: '10:30',
      duration: '17h 40m',
      price: 3500,
      stops: 'Non-stop',
      type: 'Rajdhani',
      class: '3AC',
      rating: 4.7,
    },
    {
      _id: 23,
      trainName: 'Poorva Express',
      trainNumber: '12382',
      source: 'Kolkata',
      destination: 'Delhi',
      departure: '14:15',
      arrival: '09:30',
      duration: '19h 15m',
      price: 2400,
      stops: '2+ Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.4,
    },
    {
      _id: 24,
      trainName: 'Netaji Express',
      trainNumber: '12311',
      source: 'Kolkata',
      destination: 'Delhi',
      departure: '21:15',
      arrival: '13:45',
      duration: '16h 30m',
      price: 2200,
      stops: '3 Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.2,
    },
    {
      _id: 25,
      trainName: 'Duronto Express',
      trainNumber: '12274',
      source: 'Kolkata',
      destination: 'Delhi',
      departure: '10:00',
      arrival: '03:00',
      duration: '17h 00m',
      price: 3100,
      stops: 'Non-stop',
      type: 'Superfast',
      class: 'Sleeper',
      rating: 4.6,
    },

    // Hyderabad → Chennai (3 trains)
    {
      _id: 26,
      trainName: 'Hyderabad Express',
      trainNumber: '12703',
      source: 'Hyderabad',
      destination: 'Chennai',
      departure: '06:30',
      arrival: '14:45',
      duration: '8h 15m',
      price: 1150,
      stops: '3 Stops',
      type: 'Superfast',
      class: '3AC',
      rating: 4.3,
    },
    {
      _id: 27,
      trainName: 'Pushpak Express',
      trainNumber: '12703',
      source: 'Hyderabad',
      destination: 'Chennai',
      departure: '15:00',
      arrival: '23:30',
      duration: '8h 30m',
      price: 1100,
      stops: '2 Stops',
      type: 'Superfast',
      class: 'Sleeper',
      rating: 4.4,
    },
    {
      _id: 28,
      trainName: 'East Coast Express',
      trainNumber: '12840',
      source: 'Hyderabad',
      destination: 'Chennai',
      departure: '21:30',
      arrival: '05:45',
      duration: '8h 15m',
      price: 900,
      stops: '4 Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.0,
    },

    // Pune → Delhi (3 trains)
    {
      _id: 29,
      trainName: 'Pune Delhi Express',
      trainNumber: '12137',
      source: 'Pune',
      destination: 'Delhi',
      departure: '00:30',
      arrival: '16:45',
      duration: '16h 15m',
      price: 2100,
      stops: '2+ Stops',
      type: 'Express',
      class: '3AC',
      rating: 4.2,
    },
    {
      _id: 30,
      trainName: 'Jhelum Express',
      trainNumber: '11077',
      source: 'Pune',
      destination: 'Delhi',
      departure: '09:30',
      arrival: '04:00',
      duration: '18h 30m',
      price: 1900,
      stops: '2+ Stops',
      type: 'Express',
      class: 'Sleeper',
      rating: 4.1,
    },
  ], []);

  // Filter trains based on search parameters only (no UI filters - matching FlightsPage)
  const filteredTrains = useMemo(() => {
    let result = allTrains;

    if (searchFrom && searchFrom.trim()) {
      result = result.filter(train =>
        train.source.trim().toLowerCase() === searchFrom.trim().toLowerCase()
      );
    }

    if (searchTo && searchTo.trim()) {
      result = result.filter(train =>
        train.destination.trim().toLowerCase() === searchTo.trim().toLowerCase()
      );
    }

    return result;
  }, [searchFrom, searchTo, allTrains]);

  // Fallback if no exact matches
  const results = useMemo(() => {
    if (filteredTrains.length === 0) {
      return allTrains;
    }
    return filteredTrains;
  }, [filteredTrains, allTrains]);

  // Sort trains (matching FlightsPage)
  const sortedTrains = useMemo(() => {
    let sorted = [...results];

    if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'departure') {
      sorted.sort((a, b) => a.departure.localeCompare(b.departure));
    } else if (sortBy === 'duration') {
      sorted.sort((a, b) => {
        const aDuration = parseInt(a.duration.replace('h', '').replace('m', '').split(' ')[0]) * 60 + parseInt(a.duration.match(/(\d+)m/)?.[1] || 0);
        const bDuration = parseInt(b.duration.replace('h', '').replace('m', '').split(' ')[0]) * 60 + parseInt(b.duration.match(/(\d+)m/)?.[1] || 0);
        return aDuration - bDuration;
      });
    }

    return sorted;
  }, [results, sortBy]);

  const handleBook = (train) => {
    handleBooking(navigate, 'train', train);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary - EXACT match to FlightsPage */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/60 p-6 mb-8 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2.5 rounded-xl">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">From</p>
                  <p className="font-bold text-gray-900">{searchFrom || 'Any City'}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2.5 rounded-xl">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">To</p>
                  <p className="font-bold text-gray-900">{searchTo || 'Any City'}</p>
                </div>
              </div>
              {date && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                    <p className="font-bold text-gray-900">{date}</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (searchFrom) params.append('source', searchFrom);
                if (searchTo) params.append('destination', searchTo);
                if (date) params.append('date', date);
                navigate(`/results/trains?${params.toString()}`);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              View All Results
            </button>
          </div>
        </div>

        {/* Results Header - EXACT match to FlightsPage */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              Available Trains
              {user?.role?.toLowerCase() === 'admin' && (
                <AdminAddButton label="Add Train" onClick={() => { setEditingTrain(null); setShowEditModal(true); }} />
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              {sortedTrains.length} {sortedTrains.length === 1 ? 'train' : 'trains'} found
              {searchFrom && searchTo && ` from ${searchFrom} to ${searchTo}`}
              {filteredTrains.length === 0 && searchFrom && searchTo && (
                <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  Showing all available trains
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm cursor-pointer hover:border-purple-300 transition-all"
              >
                <option value="price">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="departure">Departure Time</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Train Cards - EXACT match to FlightsPage UI */}
        {sortedTrains.length > 0 ? (
          <div className="space-y-6">
            {sortedTrains.map((train) => (
              <div
                key={train._id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border border-gray-100 p-6"
              >
                {user?.role?.toLowerCase() === 'admin' && (
                  <AdminEditButton onClick={() => handleEdit(train)} />
                )}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* LEFT: Train Name + Number, FROM City, Departure Time */}
                  <div className="flex flex-col gap-3 lg:w-1/4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {train.trainName}
                      </p>
                      <p className="text-sm font-mono text-gray-600 mt-0.5">{train.trainNumber}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{train.source}</p>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{train.departure}</p>
                    </div>
                  </div>

                  {/* CENTER: Train Path, Duration, Stops Badge */}
                  <div className="flex flex-col items-center justify-center gap-3 lg:w-2/4">
                    <div className="flex items-center gap-4 w-full">
                      <p className="text-sm font-bold text-gray-900 min-w-[60px]">{train.departure}</p>

                      {/* Train path line with train icon */}
                      <div className="flex items-center gap-2 flex-1">
                        <div className="h-1 flex-1 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 rounded-full"></div>
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full shadow-md flex-shrink-0">
                          <Train className="h-4 w-4 text-white" />
                        </div>
                        <div className="h-1 flex-1 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 rounded-full"></div>
                      </div>

                      <p className="text-sm font-bold text-gray-900 min-w-[60px]">{train.arrival}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 font-medium">{train.duration}</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        train.stops === 'Non-stop'
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200'
                          : train.stops === '1 Stop'
                          ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-700 border-amber-200'
                          : 'bg-gradient-to-r from-orange-50 to-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {train.stops}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: TO City, Arrival Time, Date */}
                  <div className="flex flex-col items-end gap-2 text-right lg:w-1/4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{train.destination}</p>
                      <p className="text-lg font-semibold text-gray-800">{train.arrival}</p>
                      <p className="text-sm text-gray-500 mt-1">{date || train.date || 'Select date'}</p>
                    </div>
                  </div>

                  {/* FAR RIGHT: Price & Book Button */}
                  <div className="flex flex-col items-center lg:items-end gap-3 lg:w-1/4">
                    <div className="text-center lg:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</p>
                      <div className="flex items-center justify-center lg:justify-end gap-1">
                        <IndianRupee className="h-5 w-5 text-purple-600" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                          {train.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">per person</p>
                    </div>
                    <button
                      onClick={() => handleBook(train)}
                      className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - EXACT match to FlightsPage */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center hover:border-purple-300 transition-colors duration-300">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Train className="h-12 w-12 text-purple-600 opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No trains found</h3>
              <p className="text-gray-600 mb-6">
                {searchFrom && searchTo
                  ? `Sorry, we couldn't find any trains from ${searchFrom} to ${searchTo}. Try different cities or check back later!`
                  : 'Enter your departure and destination cities to see available trains.'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Modify Search
              </button>
            </div>
          </div>
        )}
      </div>

      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        serviceType="train"
        item={editingTrain}
        onSave={(updatedTrain) => {
          // Local update if we had state for allTrains
          setShowEditModal(false);
          setEditingTrain(null);
        }}
      />
    </div>
  );
};

export default TrainsPage;
