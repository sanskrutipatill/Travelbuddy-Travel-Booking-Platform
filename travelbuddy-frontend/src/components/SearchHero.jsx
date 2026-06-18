import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft, Calendar, Users, Navigation, Plane, Train, Car, Hotel as HotelIcon, Package, MapPin } from 'lucide-react';

const SearchHero = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState('flights');

  // Form states
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState('1');

  // Trip type (only for flights)
  const [tripType, setTripType] = useState('roundtrip');

  // Additional states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [duration, setDuration] = useState('');
  const [destination, setDestination] = useState('');

  // Tab configurations
  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: HotelIcon },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'cabs', label: 'Cabs', icon: Car },
    { id: 'tours', label: 'Tours', icon: MapPin },
  ];

  // Reset form when tab changes
  useEffect(() => {
    setFrom('');
    setTo('');
    setDeparture('');
    setReturnDate('');
    setTravelers('1');
    setTripType('roundtrip');
    setDuration('');
    setDestination('');
  }, [activeTab]);

  // GPS Location handler
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'travelbuddy-app' } }
          );
          if (!response.ok) throw new Error('API error');
          const data = await response.json();
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.state_district || address.state || '';
          if (city) {
            setFrom(city);
          } else {
            alert('Could not detect city name. Please enter manually.');
          }
        } catch (error) {
          console.error('GPS error:', error);
          alert('Failed to detect location. Please enter manually.');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        setGpsLoading(false);
        console.error('Geolocation error:', error);
        alert('Location access denied. Please enter manually.');
      }
    );
  }, []);

  // Swap from/to
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();

    const formData = {};

    if (activeTab === 'flights' || activeTab === 'trains' || activeTab === 'cabs') {
      if (!from.trim() || !to.trim()) {
        alert('Please enter both From and To locations');
        return;
      }
      if (from.trim() === to.trim()) {
        alert('Source and destination cannot be the same');
        return;
      }
      if (!departure) {
        alert('Please select a departure date');
        return;
      }
      formData.from = from.trim();
      formData.to = to.trim();
      formData.departure = departure;
      formData.travelers = parseInt(travelers) || 1;

      if (activeTab === 'flights') {
        if (tripType === 'roundtrip') {
          if (!returnDate) {
            alert('Please select a return date');
            return;
          }
          formData.returnDate = returnDate;
        }
        formData.tripType = tripType;
      }

      if (activeTab === 'trains' || activeTab === 'flights') {
        formData.class = 'Economy'; // default, can be extended
      }

      if (activeTab === 'cabs') {
        formData.returnDate = ''; // optional
      }
    } else if (activeTab === 'hotels') {
      if (!from.trim()) {
        alert('Please enter a location');
        return;
      }
      if (!departure) {
        alert('Please select check-in date');
        return;
      }
      formData.location = from.trim();
      formData.checkIn = departure;
      formData.checkOut = returnDate || '';
      formData.guests = parseInt(travelers) || 1;
    } else if (activeTab === 'packages') {
      if (!destination.trim()) {
        alert('Please enter a destination');
        return;
      }
      if (!duration) {
        alert('Please enter duration');
        return;
      }
      formData.destination = destination.trim();
      formData.duration = parseInt(duration) || 3;
      formData.travelers = parseInt(travelers) || 1;
    } else if (activeTab === 'tours') {
      if (!destination.trim()) {
        alert('Please enter a destination');
        return;
      }
      if (!duration) {
        alert('Please enter duration');
        return;
      }
      formData.destination = destination.trim();
      formData.duration = parseInt(duration) || 3;
      formData.travelers = parseInt(travelers) || 1;
    }

    console.log('🔍 Searching:', activeTab, formData);
    navigate(`/results/${activeTab}`, { state: formData });
  };

  // Check if GPS should be shown
  const showGps = ['flights', 'trains', 'cabs'].includes(activeTab);

  // Placeholder text based on active tab
  const getFromPlaceholder = () => {
    switch (activeTab) {
      case 'flights':
      case 'trains':
        return 'Enter city or airport';
      case 'cabs':
        return 'Enter pickup location';
      case 'hotels':
        return 'Enter city or location';
      case 'packages':
      case 'tours':
        return 'Enter destination';
      default:
        return 'Enter location';
    }
  };

  const getToPlaceholder = () => {
    switch (activeTab) {
      case 'flights':
      case 'trains':
        return 'Enter city or airport';
      case 'cabs':
        return 'Enter drop location';
      default:
        return 'Enter destination';
    }
  };

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="w-full border-b mb-4">
        <div className="grid grid-cols-6 gap-2 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-center py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">

          {/* Trip type selector (flights only) */}
          {activeTab === 'flights' && (
            <div className="flex items-center space-x-4 mb-6">
              {['oneway', 'roundtrip', 'multicity'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tripType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('trip', ' Trip')}
                </button>
              ))}
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

            {/* FROM */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {activeTab === 'hotels' ? 'Location' : activeTab === 'packages' || activeTab === 'tours' ? 'Destination' : 'From'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={getFromPlaceholder()}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={`w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium ${showGps ? 'pl-10 pr-12' : 'pl-4 pr-4'}`}
                  required
                />
                {showGps && (
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-500 disabled:opacity-50 transition-colors"
                    title="Use current location"
                  >
                    {gpsLoading ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* TO (skip for Hotels and Packages/Tours) */}
            {(activeTab === 'flights' || activeTab === 'trains' || activeTab === 'cabs') && (
              <>
                <div className="lg:col-span-1 flex justify-center pb-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={getToPlaceholder()}
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* DATE */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {activeTab === 'hotels' ? 'Check-in' : activeTab === 'packages' || activeTab === 'tours' ? 'Start Date' : 'Departure'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium"
                  required={activeTab !== 'packages' && activeTab !== 'tours'}
                />
              </div>
            </div>

            {/* RETURN (for flights) OR DURATION (for packages/tours) */}
            {activeTab === 'flights' && tripType === 'roundtrip' && (
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Return
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {(activeTab === 'packages' || activeTab === 'tours') && (
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Duration (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    placeholder="e.g., 5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* Check-out for hotels */}
            {activeTab === 'hotels' && (
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Check-out
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* TRAVELLERS / GUESTS */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {activeTab === 'hotels' ? 'Guests' : 'Travellers'}
              </label>
              <div className="relative">
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-sm font-medium bg-white appearance-none"
                >
                  {activeTab === 'hotels' ? (
                    <>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </>
                  ) : (
                    <>
                      <option value="1">1 Traveller</option>
                      <option value="2">2 Travellers</option>
                      <option value="3">3 Travellers</option>
                      <option value="4">4 Travellers</option>
                      <option value="5">5+ Travellers</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="lg:col-span-1">
              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>SEARCH</span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHero;
