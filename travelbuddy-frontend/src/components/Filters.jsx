import React from 'react';

const TIME_BUCKETS = [
  { id: 'earlyMorning', label: 'Early Morning (12am - 6am)' },
  { id: 'morning', label: 'Morning (6am - 12pm)' },
  { id: 'midDay', label: 'Mid-Day (12pm - 4pm)' },
  { id: 'evening', label: 'Evening (4pm - 8pm)' },
  { id: 'night', label: 'Night (8pm - 12am)' },
];

const COMMON_AIRLINES = ['Indigo', 'Air India', 'SpiceJet', 'Vistara', 'Go First', 'AirAsia', 'Akasa Air'];

const Filters = ({ filters, onFilterChange, availableAirlines = COMMON_AIRLINES, serviceType = 'flights' }) => {
  const handleCheckbox = (category, value) => {
    const current = filters[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(category, updated);
  };

  const handlePriceChange = (type, value) => {
    onFilterChange(type, value);
  };

  const handleReset = () => {
    onFilterChange('stops', []);
    onFilterChange('departureTimes', []);
    onFilterChange('minPrice', '');
    onFilterChange('maxPrice', '');
    onFilterChange('airlines', []);
  };

  return (
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

      {/* Stops */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Stops</h3>
        <div className="space-y-2">
          {[
            { label: 'Non-stop', value: 0 },
            { label: '1 Stop', value: 1 },
            { label: '2+ Stops', value: 2 },
          ].map((stop) => (
            <label key={stop.value} className="flex items-center cursor-pointer group">
              <input
                id={`stops-${stop.value}`}
                name={`stops[]`}
                type="checkbox"
                checked={filters.stops?.includes(stop.value) || false}
                onChange={() => handleCheckbox('stops', stop.value)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{stop.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">Departure Time</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {TIME_BUCKETS.map((time) => (
            <label key={time.id} className="flex items-center cursor-pointer group">
              <input
                id={`departure-${time.id}`}
                name={`departureTimes[]`}
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
              id="min-price"
              name="minPrice"
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="text-gray-400 text-sm">-</span>
          <div className="flex-1">
            <input
              id="max-price"
              name="maxPrice"
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Airlines / Train Types */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">
          {serviceType === 'trains' ? 'Train Types' : 'Airlines'}
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {availableAirlines.map((airline) => (
            <label key={airline} className="flex items-center cursor-pointer group">
              <input
                id={`airline-${airline.replace(/\s+/g, '-').toLowerCase()}`}
                name={`airlines[]`}
                type="checkbox"
                checked={filters.airlines?.includes(airline) || false}
                onChange={() => handleCheckbox('airlines', airline)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{airline}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
