import React from 'react';
import { Plane } from 'lucide-react';

const FlightCard = ({ flight, onBook, onViewDetails }) => {
  const { _id, airline, flightNumber, source, destination, departureTime, arrivalTime, duration, stops = 0, price } = flight;

  const stopsLabel = stops === 0 ? 'Non-stop' : stops === 1 ? '1 Stop' : `${stops} Stops`;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] border border-gray-200 transition-all duration-200 p-4 flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
      {/* Left: Airline Info */}
      <div className="flex items-center gap-3 w-full lg:w-auto lg:min-w-[140px]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Plane className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{airline}</div>
          <div className="text-xs text-gray-500">{flightNumber}</div>
        </div>
      </div>

      {/* Middle: Flight Route Info */}
      <div className="flex-1 flex flex-col w-full">
        {/* Times and locations row */}
        <div className="flex items-center justify-between w-full">
          {/* Departure */}
          <div className="text-left">
            <div className="text-xl font-bold text-gray-900">{departureTime}</div>
            <div className="text-sm text-gray-600 font-medium truncate">{source}</div>
          </div>

          {/* Connect line with duration and stops */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 px-4">
            <div className="relative w-24 h-px bg-gray-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 border border-gray-300 rounded-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-400 whitespace-nowrap">{duration}</div>
              <div className="text-xs text-gray-600 font-medium">{stopsLabel}</div>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{arrivalTime}</div>
            <div className="text-sm text-gray-600 font-medium truncate">{destination}</div>
          </div>
        </div>
      </div>

      {/* Right: Price & Booking */}
      <div className="flex flex-col items-end justify-center w-full lg:w-auto gap-2 border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-6 mt-1">
        <div className="flex-shrink-0">
          <div className="text-2xl font-extrabold text-gray-900">₹{price.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500">per person</div>
        </div>
        <button
          onClick={() => onBook(flight)}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
