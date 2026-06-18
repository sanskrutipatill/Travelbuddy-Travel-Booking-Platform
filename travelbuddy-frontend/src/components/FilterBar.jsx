import React, { useState } from 'react';
import { Plane, Clock, DollarSign, Wind, MapPin, Ban, ChevronDown } from 'lucide-react';

const FILTERS = [
  { id: 'stops', label: 'Stops', icon: Ban },
  { id: 'airlines', label: 'Airlines', icon: Plane },
  { id: 'price', label: 'Price', icon: DollarSign },
  { id: 'times', label: 'Times', icon: Clock },
  { id: 'emissions', label: 'Emissions', icon: Wind },
  { id: 'connecting', label: 'Connecting airports', icon: MapPin },
  { id: 'duration', label: 'Duration', icon: Clock },
];

const FilterBar = ({ flights = [], activeFilters = {}, onFilterChange }) => {
  const [showAll, setShowAll] = useState(false);

  // Determine which filters have options available
  const getFilterAvailability = () => {
    if (!flights.length) return {};

    const availability = {};

    // Stops
    const stopsSet = new Set(flights.map(f => f.stops || 0));
    availability.stops = stopsSet.size > 1;

    // Airlines
    const airlinesSet = new Set(flights.map(f => f.airline));
    availability.airlines = airlinesSet.size > 1;

    // Price range
    const prices = flights.map(f => f.price);
    availability.price = Math.max(...prices) - Math.min(...prices) > 1000;

    // Times - check if flights at different times of day
    const getTimeBucket = (time) => {
      const hour = parseInt(time.split(':')[0]);
      if (hour < 12) return 'Morning';
      if (hour < 17) return 'Afternoon';
      return 'Evening';
    };
    const timesSet = new Set(flights.map(f => getTimeBucket(f.departureTime)));
    availability.times = timesSet.size > 1;

    // Duration
    availability.duration = flights.length > 1;

    // Connecting airports - would need actual data
    availability.connecting = false;

    // Emissions - would need airline emissions data
    availability.emissions = false;

    return availability;
  };

  const availability = getFilterAvailability();

  const visibleFilters = showAll ? FILTERS : FILTERS.slice(0, 5);

  return (
    <div className="border-b border-gray-200 bg-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* All */}
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              Object.keys(activeFilters).length === 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onFilterChange && onFilterChange({})}
          >
            All
          </button>

          {visibleFilters.map((filter) => {
            const isActive = activeFilters[filter.id];
            const isAvailable = availability[filter.id];
            const Icon = filter.icon;

            return (
              <button
                key={filter.id}
                disabled={!isAvailable}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isAvailable
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
                onClick={() => onFilterChange && onFilterChange({ [filter.id]: !isActive })}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}

          {/* Show more/less */}
          {FILTERS.length > 5 && (
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Less' : 'More'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
