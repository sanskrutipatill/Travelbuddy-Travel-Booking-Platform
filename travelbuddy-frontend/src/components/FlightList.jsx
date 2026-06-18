import React from 'react';
import { Plane, Edit2, Trash2 } from 'lucide-react';

const FlightList = ({ flights, sortBy, onSortChange, onBook, loading, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-800">
          <span className="font-bold text-gray-900">{flights.length}</span> flights available
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-2 pr-6 py-1.5 border border-gray-200 rounded text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer bg-white"
          >
            <option value="best">Recommended</option>
            <option value="price">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Fastest Duration</option>
            <option value="departure">Departure Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : flights.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center mt-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No flights found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any flights matching your criteria. Try adjusting your dates or locations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => {
            const isNonStop = flight.stops === 0 || flight.stops === 'Non-stop';

            return (
              <div
                key={flight._id || flight.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between hover:shadow-sm transition-shadow relative group"
              >
                {/* Admin badge */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">Admin</span>
                  </div>
                )}

                {/* Admin buttons */}
                {isAdmin && (
                  <div className="absolute top-2 right-16 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(flight, 'flight')}
                      className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow transition-colors"
                      title="Edit Flight"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(flight._id, 'flight')}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition-colors"
                      title="Delete Flight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Airline Info */}
                <div className="flex items-center gap-4 w-full md:w-[22%] mb-4 md:mb-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plane className="h-5 w-5 text-white transform -rotate-45" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900 leading-tight">{flight.airline}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">{flight.flightNumber}</p>
                  </div>
                </div>

                {/* Departure Time */}
                <div className="text-center w-full md:w-[15%] mb-2 md:mb-0">
                  <div className="text-[17px] font-bold text-gray-900">{flight.departureTime || flight.departure}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{flight.source}</div>
                </div>

                {/* Journey Line */}
                <div className="flex flex-col items-center justify-center w-full md:w-[20%] px-4 mb-2 md:mb-0">
                  <span className="text-[10px] font-medium text-gray-400 mb-1">{flight.duration}</span>
                  <div className="w-full relative flex items-center justify-center py-1">
                    <div className="w-full h-[1px] bg-gray-300 absolute"></div>
                    <div className="w-2 h-2 rounded-full border border-gray-400 bg-white z-10 relative"></div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 mt-1">
                    {isNonStop ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                </div>

                {/* Arrival Time */}
                <div className="text-center w-full md:w-[15%] mb-4 md:mb-0">
                  <div className="text-[17px] font-bold text-gray-900">{flight.arrivalTime || flight.arrival}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{flight.destination}</div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-[28%]">
                  <div className="text-right">
                    <div className="text-[20px] font-bold text-gray-900 tracking-tight">
                      ₹{flight.price?.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">per person</p>
                  </div>
                  <button
                    onClick={() => onBook(flight)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-[13px] font-medium rounded transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlightList;