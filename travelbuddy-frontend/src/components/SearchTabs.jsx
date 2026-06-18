import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, Train, CarTaxiFront, Calendar, ChevronDown } from 'lucide-react';

import LocationInput from './LocationInput';
import TravellerSelector from './TravellerSelector';
import ClassSelector from './ClassSelector';

const cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

// Mapping of common geocoded city names to our cities list
const CITY_ALIASES = {
  'bengaluru': 'Bangalore',
  'delhi': 'New Delhi',
  'new delhi': 'New Delhi',
  'mumbai': 'Mumbai',
  'chennai': 'Chennai',
  'kolkata': 'Kolkata',
  'hyderabad': 'Hyderabad',
  'pune': 'Pune',
};

const SearchTabs = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const navigate = useNavigate();

  // Form states
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travelClass, setTravelClass] = useState('Economy');

  // Traveller state
  const [travellers, setTravellers] = useState({ adults: 1, children: 0, infantsSeat: 0, infantsLap: 0 });
  const [showTravellerModal, setShowTravellerModal] = useState(false);

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);

  // Auto-detect location on mount (with loading indicator)
  useEffect(() => {
    const detectLocation = async () => {
      if (!navigator.geolocation) {
        return;
      }
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        let city = data.address?.city || data.address?.town || data.address?.county || data.address?.state || data.address?.country;
        if (city) {
          const normalized = CITY_ALIASES[city.toLowerCase()] || city;
          if (cities.some(c => c.toLowerCase() === normalized.toLowerCase())) {
            setSource(normalized);
          }
        }
      } catch (error) {
        // Silently fail - user denied or error
        console.log('Auto-location detection failed:', error);
      }
    };
    detectLocation();
  }, []);

  const handleGetLocation = () => {
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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          let city = data.address?.city || data.address?.town || data.address?.county || data.address?.state || data.address?.country;
          if (city) {
            const normalized = CITY_ALIASES[city.toLowerCase()] || city;
            if (cities.some(c => c.toLowerCase() === normalized.toLowerCase())) {
              setSource(normalized);
            } else {
              alert(`Detected location "${city}" is not in our service area. Please select manually.`);
            }
          }
        } catch (error) {
          console.error('Geolocation reverse lookup failed:', error);
          alert('Failed to detect location. Please select manually.');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        setGpsLoading(false);
        console.log('Geolocation error:', error);
        alert('Location access denied. Please select manually.');
      }
    );
  };

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'cabs', label: 'Cabs', icon: CarTaxiFront },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (source) query.append('source', source);
    if (destination) query.append('destination', destination);
    if (date) query.append('date', date);
    // Include passengers for all services that have TravellerSelector
    if (['flights', 'trains', 'cabs'].includes(activeTab)) {
      const totalPassengers = travellers.adults + travellers.children + travellers.infantsSeat + travellers.infantsLap;
      query.append('passengers', totalPassengers);
    }
    if (['flights', 'trains'].includes(activeTab)) {
      query.append('class', travelClass);
    }

    navigate(`/results/${activeTab}?${query.toString()}`);
  };

  const getTravellerLabel = () => {
    const parts = [];
    if (travellers.adults > 0) parts.push(`${travellers.adults} Adult${travellers.adults > 1 ? 's' : ''}`);
    if (travellers.children > 0) parts.push(`${travellers.children} Child${travellers.children > 1 ? 'ren' : ''}`);
    return parts.join(', ') || '1 Adult';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl mx-auto -mt-24 relative z-10 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-4 px-6 min-w-[100px] transition-all duration-300 relative ${
              activeTab === tab.id
                ? 'text-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <tab.icon className={`h-6 w-6 mb-2 ${activeTab === tab.id ? 'transform scale-110' : ''} transition-transform`} />
            <span className="font-semibold text-sm">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-8">
        <form onSubmit={handleSearch} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            {/* Location fields (From & To) for flights & trains */}
            {['flights', 'trains'].includes(activeTab) && (
              <>
                <div className="relative group">
                  <LocationInput
                    id="source-input"
                    label="From"
                    value={source}
                    onChange={setSource}
                    placeholder="City.."
                    required
                    travelType={activeTab}
                    showGpsButton={true}
                    onGpsClick={handleGetLocation}
                    gpsLoading={gpsLoading}
                  />
                </div>

                <div className="relative group">
                  <LocationInput
                    id="destination-input"
                    label="To"
                    value={destination}
                    onChange={setDestination}
                    placeholder="City.."
                    required
                    travelType={activeTab}
                  />
                </div>
              </>
            )}

            {/* Hotels location */}
            {activeTab === 'hotels' && (
              <div className="relative group md:col-span-2">
                <LocationInput
                  id="hotels-location-input"
                  label="City / Location"
                  value={source}
                  onChange={setSource}
                  placeholder="Where do you want to stay?"
                  required
                  travelType="hotels"
                  showGpsButton={true}
                  onGpsClick={handleGetLocation}
                  gpsLoading={gpsLoading}
                />
              </div>
            )}

            {/* Cabs pickup & drop */}
            {activeTab === 'cabs' && (
              <>
                <div className="relative group">
                  <LocationInput
                    id="cab-pickup-input"
                    label="Pickup"
                    value={source}
                    onChange={setSource}
                    placeholder="Pickup location"
                    required
                    travelType="cabs"
                    showGpsButton={true}
                    onGpsClick={handleGetLocation}
                    gpsLoading={gpsLoading}
                  />
                </div>

                <div className="relative group">
                  <LocationInput
                    id="cab-drop-input"
                    label="Drop"
                    value={destination}
                    onChange={setDestination}
                    placeholder="Drop location"
                    required
                    travelType="cabs"
                  />
                </div>
              </>
            )}

            {/* Date field */}
            <div className="relative group">
              <label htmlFor="search-date-input" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {activeTab === 'hotels' ? 'Check-in' : 'Date'}
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 h-5 w-5 text-gray-400" />
                <input
                  id="search-date-input"
                  name="date"
                  type="date"
                  required={activeTab !== 'hotels'}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 w-full text-lg font-medium text-gray-900 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 py-2 bg-transparent transition-colors"
                />
              </div>
            </div>

            {/* Class selector for flights & trains */}
            {['flights', 'trains'].includes(activeTab) && (
              <div className="relative group">
                <ClassSelector
                  id="class-select"
                  value={travelClass}
                  onChange={setTravelClass}
                />
              </div>
            )}

            {/* Traveller selector for flights, trains, and cabs */}
            {(['flights', 'trains', 'cabs'].includes(activeTab)) && (
              <div className="relative group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Travellers
                </label>
                <button
                  type="button"
                  onClick={() => setShowTravellerModal(true)}
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                >
                  <span className="text-gray-900">{getTravellerLabel()}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all flex justify-center items-center space-x-2 mx-auto"
            >
              <span>Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Traveller Selector Modal */}
      <TravellerSelector
        isOpen={showTravellerModal}
        onClose={() => setShowTravellerModal(false)}
        onSave={setTravellers}
        initialValues={travellers}
      />
    </div>
  );
};

export default SearchTabs;
