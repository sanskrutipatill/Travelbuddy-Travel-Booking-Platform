import React from 'react';

const HotelFilters = ({ filters, onFilterChange, availableLocations }) => {
  const handleChange = (category, value) => {
    onFilterChange(category, value);
  };

  const toggleArrayItem = (category, value) => {
    onFilterChange(category, value);
  };

  const clearFilters = () => {
    onFilterChange('location', '');
    onFilterChange('minPrice', '');
    onFilterChange('maxPrice', '');
    onFilterChange('rating', []);
    onFilterChange('amenities', []);
    onFilterChange('propertyTypes', []);
  };

  const hasActiveFilters = Object.values(filters).some(val => {
    if (Array.isArray(val)) return val.length > 0;
    return val !== '';
  });

  return (
    <div className="space-y-4">
      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">📍 Location</label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="City, region, or hotel"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {availableLocations && availableLocations.length > 0 && (
          <div className="mt-2 max-h-32 overflow-y-auto">
            {availableLocations.slice(0, 5).map(loc => (
              <button
                key={loc}
                onClick={() => handleChange('location', loc)}
                className={`block w-full text-left px-2 py-1.5 text-xs rounded ${
                  filters.location === loc ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">💰 Price Range (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">⭐ Minimum Rating</label>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.rating?.includes(rating) || false}
                onChange={() => toggleArrayItem('rating', rating)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <span className="text-yellow-500">★</span> {rating}+ stars
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">🏨 Property Type</label>
        <div className="space-y-2">
          {['Hotel', 'Villa', 'Resort', 'Apartment', 'Boutique', 'Guest House'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.propertyTypes?.includes(type) || false}
                onChange={() => toggleArrayItem('propertyTypes', type)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">🛎 Amenities</label>
        <div className="space-y-2">
          {[
            'Free WiFi',
            'Swimming Pool',
            'Spa',
            'Gym',
            'Restaurant',
            'Free Parking',
            'Airport Transfer',
            'Business Center',
            'Pet Friendly',
            'Free Cancellation'
          ].map(amenity => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={() => toggleArrayItem('amenities', amenity)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelFilters;
