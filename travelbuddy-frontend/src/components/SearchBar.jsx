import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Plane, Train, Car, CalendarDays, Users, ChevronDown, Search } from 'lucide-react';

const TRAVELLER_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);
const CLASS_OPTIONS = ['Economy', 'Business', 'First'];

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { type: routeType } = useParams(); // Get type from route params (e.g., /results/trains)

  const [formData, setFormData] = useState({
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    departureDate: searchParams.get('date') || '',
    returnDate: searchParams.get('returnDate') || '',
    travellers: searchParams.get('travellers') || '1',
    travelClass: searchParams.get('class') || 'Economy',
  });

  useEffect(() => {
    setFormData({
      source: searchParams.get('source') || '',
      destination: searchParams.get('destination') || '',
      departureDate: searchParams.get('date') || '',
      returnDate: searchParams.get('returnDate') || '',
      travellers: searchParams.get('travellers') || '1',
      travelClass: searchParams.get('class') || 'Economy',
    });
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Determine effective service type for UI customization
  const effectiveType = routeType || searchParams.get('type') || 'flights';
  const isTrain = effectiveType === 'trains';
  const isCab = effectiveType === 'cabs';

  // Dynamic labels and placeholders based on service type
  const labelFrom = isCab ? 'Pickup' : isTrain ? 'From' : 'From';
  const labelTo = isCab ? 'Drop' : isTrain ? 'To' : 'To';
  const placeholderFrom = isCab ? 'Pickup location' : isTrain ? 'City or station' : 'City..';
  const placeholderTo = isCab ? 'Drop location' : isTrain ? 'City or station' : 'City..';
  const LocationIcon = isCab ? Car : isTrain ? Train : Plane;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.source) params.set('source', formData.source.trim());
    if (formData.destination) params.set('destination', formData.destination.trim());
    if (formData.departureDate) params.set('date', formData.departureDate);
    if (formData.returnDate) params.set('returnDate', formData.returnDate);
    if (formData.travellers && formData.travellers !== '1') params.set('travellers', formData.travellers);
    if (formData.travelClass && formData.travelClass !== 'Economy') params.set('class', formData.travelClass);

    // Use route parameter if available, otherwise fallback to search param or default
    const effectiveType = routeType || searchParams.get('type') || 'flights';
    const url = `/results/${effectiveType}?${params.toString()}`;
    console.log('🔍 SearchBar navigating to:', url);
    navigate(url);
  };

  const handleReset = () => {
    setFormData({
      source: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      travellers: '1',
      travelClass: 'Economy',
    });
    const effectiveType = routeType || searchParams.get('type') || 'flights';
    navigate(`/results/${effectiveType}`);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-2">
          {/* From */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">{labelFrom}</label>
            <div className="relative">
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder={placeholderFrom}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* To */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">{labelTo}</label>
            <div className="relative">
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder={placeholderTo}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-90" />
            </div>
          </div>

          {/* Departure Date */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Departure</label>
            <div className="relative">
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none"
              />
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Return Date (hidden for cabs) */}
          {!isCab && (
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Return <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none"
                />
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Travellers/Passengers */}
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {isCab ? 'Passengers' : 'Travellers'}
            </label>
            <div className="relative">
              <select
                name="travellers"
                value={formData.travellers}
                onChange={handleChange}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none bg-white cursor-pointer"
              >
                {TRAVELLER_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num} P{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Class (hidden for cabs) */}
          {!isCab && (
            <div className="flex-1 min-w-[90px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
              <div className="relative">
                <select
                  name="travelClass"
                  value={formData.travelClass}
                  onChange={handleChange}
                  className="w-full pl-3 pr-8 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none bg-white cursor-pointer"
                >
                  {CLASS_OPTIONS.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls.slice(0, 4)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2 text-sm font-semibold rounded-md shadow-sm hover:shadow transition-all self-end mb-[2px]"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors self-end mb-[2px]"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
