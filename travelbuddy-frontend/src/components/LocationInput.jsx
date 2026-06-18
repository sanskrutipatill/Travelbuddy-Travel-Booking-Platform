import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

// Expanded location data
const LOCATIONS = [
  { type: 'city', name: 'New Delhi', state: 'Delhi', country: 'India' },
  { type: 'airport', name: 'Indira Gandhi International', city: 'New Delhi', code: 'DEL', state: 'Delhi' },
  { type: 'city', name: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { type: 'airport', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', code: 'BOM', state: 'Maharashtra' },
  { type: 'city', name: 'Bangalore', state: 'Karnataka', country: 'India' },
  { type: 'city', name: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { type: 'airport', name: 'Kempegowda International', city: 'Bangalore', code: 'BLR', state: 'Karnataka' },
  { type: 'city', name: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { type: 'airport', name: 'Chennai International', city: 'Chennai', code: 'MAA', state: 'Tamil Nadu' },
  { type: 'city', name: 'Kolkata', state: 'West Bengal', country: 'India' },
  { type: 'airport', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', code: 'CCU', state: 'West Bengal' },
  { type: 'city', name: 'Hyderabad', state: 'Telangana', country: 'India' },
  { type: 'airport', name: 'Rajiv Gandhi International', city: 'Hyderabad', code: 'HYD', state: 'Telangana' },
  { type: 'city', name: 'Pune', state: 'Maharashtra', country: 'India' },
  { type: 'airport', name: 'Pune International', city: 'Pune', code: 'PNQ', state: 'Maharashtra' },
  { type: 'city', name: 'Goa', state: 'Goa', country: 'India' },
  { type: 'airport', name: 'Dabolim Airport', city: 'Goa', code: 'GOI', state: 'Goa' },
  { type: 'city', name: 'Kochi', state: 'Kerala', country: 'India' },
  { type: 'airport', name: 'Cochin International', city: 'Kochi', code: 'COK', state: 'Kerala' },
  { type: 'city', name: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { type: 'airport', name: 'Jaipur International', city: 'Jaipur', code: 'JAI', state: 'Rajasthan' },
  { type: 'city', name: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { type: 'airport', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', code: 'AMD', state: 'Gujarat' },
  { type: 'city', name: 'Guwahati', state: 'Assam', country: 'India' },
  { type: 'airport', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', code: 'GAU', state: 'Assam' },
  { type: 'city', name: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
  { type: 'airport', name: 'Chaudhary Charan Singh International', city: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh' },
  { type: 'city', name: 'Varanasi', state: 'Uttar Pradesh', country: 'India' },
  { type: 'airport', name: 'Lal Bahadur Shastri Airport', city: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh' },
  { type: 'city', name: 'Bhubaneswar', state: 'Odisha', country: 'India' },
  { type: 'airport', name: 'Biju Patnaik International', city: 'Bhubaneswar', code: 'BBI', state: 'Odisha' },
];

const CityAliases = {
  'bengaluru': 'Bangalore',
  'delhi': 'New Delhi',
  'new delhi': 'New Delhi',
  'mumbai': 'Mumbai',
  'chennai': 'Chennai',
  'kolkata': 'Kolkata',
  'hyderabad': 'Hyderabad',
  'pune': 'Pune',
};

const LocationInput = ({
  value,
  onChange,
  placeholder = 'City',
  label,
  id,
  required = false,
  showGps = false,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      const located = LOCATIONS.find(l =>
        l.type === 'city' && l.name.toLowerCase() === value.toLowerCase()
      ) || LOCATIONS.find(l =>
        l.type === 'airport' && l.city.toLowerCase() === value.toLowerCase()
      );
      if (located) {
        setInputValue(located.name);
      } else {
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFiltered([]);
      return;
    }
    const query = inputValue.toLowerCase();
    const results = LOCATIONS.filter(loc => {
      if (loc.type === 'city') {
        return loc.name.toLowerCase().includes(query) ||
               loc.state.toLowerCase().includes(query) ||
               loc.country.toLowerCase().includes(query);
      } else {
        return loc.name.toLowerCase().includes(query) ||
               loc.code.toLowerCase().includes(query) ||
               loc.city.toLowerCase().includes(query) ||
               loc.state.toLowerCase().includes(query);
      }
    });
    setFiltered(results);
    setHighlighted(-1);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (loc) => {
    if (loc.type === 'city') {
      onChange(loc.name);
      setInputValue(loc.name);
    } else {
      onChange(loc.city);
      setInputValue(loc.city);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') setIsOpen(true);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted(h => Math.min(h + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted(h => Math.max(h - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlighted >= 0 && filtered[highlighted]) {
          handleSelect(filtered[highlighted]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setInputValue('');
    inputRef.current?.focus();
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      console.error('GPS: Geolocation is not supported');
      setGpsError('Geolocation is not supported');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      });
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { headers: { 'User-Agent': 'travelbuddy-app' } }
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.state_district || address.county || address.state;
      if (city) {
        const formattedCity = address.state ? `${city}, ${address.state}` : city;
        onChange(formattedCity);
        setInputValue(formattedCity);
      } else {
        setGpsError('Could not detect city');
      }
    } catch (error) {
      console.error('GPS error:', error.message);
      setGpsError('Failed to detect location');
    } finally {
      setGpsLoading(false);
    }
  };

  const renderItem = (loc) => (
    <div
      key={`${loc.type}-${loc.name}-${loc.code || loc.state}`}
      className={`px-3 py-2 cursor-pointer flex items-start gap-2 hover:bg-blue-50 ${highlighted === filtered.indexOf(loc) ? 'bg-blue-50' : ''}`}
      onClick={() => handleSelect(loc)}
      onMouseEnter={() => setHighlighted(filtered.indexOf(loc))}
    >
      {loc.type === 'city' ? (
        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
      ) : (
        <Navigation className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-medium text-gray-900 truncate">
            {loc.type === 'city' ? loc.name : loc.city}
          </span>
          {loc.type === 'airport' && (
            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{loc.code}</span>
          )}
        </div>
        {loc.type === 'city' ? (
          <div className="text-xs text-gray-500 truncate">{loc.state}, {loc.country}</div>
        ) : (
          <div className="text-xs text-gray-500 truncate">{loc.name} • {loc.state}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* EXACT STRUCTURE REQUESTED */}
      <div className={`flex items-center h-11 px-3 gap-2 w-full bg-white transition-all ${compact ? 'border-none bg-transparent h-full' : 'border border-gray-200 rounded-lg hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'}`}>
        {/* Location icon */}
        <MapPin className={`h-4 w-4 flex-shrink-0 ${compact ? 'text-gray-400' : 'text-gray-400'}`} />

        {/* Input */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className="flex-1 min-w-0 px-2 h-full outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 bg-transparent truncate"
        />

        {/* Right side actions */}
        {inputValue && !gpsLoading && (
          <button type="button" onClick={handleClear} className="p-0.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {showGps && (
          <button
            type="button"
            onClick={detectLocation}
            disabled={gpsLoading}
            className={`p-1 ${gpsLoading ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'} disabled:opacity-50 transition-colors flex-shrink-0`}
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

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map(renderItem)}
        </div>
      )}

      {/* No results */}
      {isOpen && inputValue && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500 text-center">
          No locations found
        </div>
      )}
    </div>
  );
};

export default LocationInput;
