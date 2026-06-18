import React, { useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, MapPin, Clock, IndianRupee, ArrowRight, Filter, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { handleBooking } from '../utils/handleBooking';
import AdminEditButton from '../components/AdminEditButton';
import EditServiceModal from '../components/EditServiceModal';
import AdminAddButton from '../components/AdminAddButton';

const FlightsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const searchFrom = searchParams.get('source') || '';
  const searchTo = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const [sortBy, setSortBy] = useState('price');

  const [editingFlight, setEditingFlight] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setShowEditModal(true);
  };

  // Comprehensive flight dataset
  const allFlights = useMemo(() => [
    { _id: 1, airline: 'Air India', flightNumber: 'AI-202', source: 'Delhi', destination: 'Mumbai', departure: '06:00', arrival: '08:30', duration: '2h 30m', price: 8500, stops: 'Non-stop', rating: 4.5 },
    { _id: 2, airline: 'IndiGo', flightNumber: '6E-305', source: 'Delhi', destination: 'Mumbai', departure: '09:15', arrival: '11:45', duration: '2h 30m', price: 6200, stops: 'Non-stop', rating: 4.3 },
    { _id: 3, airline: 'SpiceJet', flightNumber: 'SG-102', source: 'Delhi', destination: 'Mumbai', departure: '14:20', arrival: '17:00', duration: '2h 40m', price: 5800, stops: 'Non-stop', rating: 4.1 },
    { _id: 4, airline: 'Vistara', flightNumber: 'UK-504', source: 'Delhi', destination: 'Mumbai', departure: '18:30', arrival: '21:10', duration: '2h 40m', price: 9200, stops: 'Non-stop', rating: 4.7 },
    { _id: 5, airline: 'Air India', flightNumber: 'AI-806', source: 'Delhi', destination: 'Mumbai', departure: '12:00', arrival: '14:35', duration: '2h 35m', price: 7800, stops: 'Non-stop', rating: 4.4 },
    { _id: 6, airline: 'Go First', flightNumber: 'G8-105', source: 'Delhi', destination: 'Mumbai', departure: '22:00', arrival: '00:30', duration: '2h 30m', price: 5400, stops: 'Non-stop', rating: 4.0 },
    { _id: 7, airline: 'IndiGo', flightNumber: '6E-556', source: 'Delhi', destination: 'Mumbai', departure: '20:15', arrival: '22:45', duration: '2h 30m', price: 6900, stops: 'Non-stop', rating: 4.2 },
    { _id: 8, airline: 'Air India', flightNumber: 'AI-605', source: 'Mumbai', destination: 'Bangalore', departure: '07:00', arrival: '09:00', duration: '2h 00m', price: 7200, stops: 'Non-stop', rating: 4.4 },
    { _id: 9, airline: 'IndiGo', flightNumber: '6E-203', source: 'Mumbai', destination: 'Bangalore', departure: '10:30', arrival: '12:30', duration: '2h 00m', price: 5500, stops: 'Non-stop', rating: 4.3 },
    { _id: 10, airline: 'Vistara', flightNumber: 'UK-512', source: 'Mumbai', destination: 'Bangalore', departure: '15:45', arrival: '17:45', duration: '2h 00m', price: 8100, stops: 'Non-stop', rating: 4.6 },
    { _id: 11, airline: 'SpiceJet', flightNumber: 'SG-301', source: 'Mumbai', destination: 'Bangalore', departure: '18:30', arrival: '20:30', duration: '2h 00m', price: 5200, stops: 'Non-stop', rating: 4.1 },
    { _id: 12, airline: 'Air India', flightNumber: 'AI-729', source: 'Mumbai', destination: 'Bangalore', departure: '21:00', arrival: '23:00', duration: '2h 00m', price: 6800, stops: 'Non-stop', rating: 4.2 },
    { _id: 13, airline: 'IndiGo', flightNumber: '6E-102', source: 'Bangalore', destination: 'Chennai', departure: '06:45', arrival: '08:00', duration: '1h 15m', price: 3800, stops: 'Non-stop', rating: 4.3 },
    { _id: 14, airline: 'Air India', flightNumber: 'AI-560', source: 'Bangalore', destination: 'Chennai', departure: '11:20', arrival: '12:35', duration: '1h 15m', price: 4200, stops: 'Non-stop', rating: 4.4 },
    { _id: 15, airline: 'Vistara', flightNumber: 'UK-256', source: 'Bangalore', destination: 'Chennai', departure: '16:10', arrival: '17:25', duration: '1h 15m', price: 4800, stops: 'Non-stop', rating: 4.6 },
    { _id: 16, airline: 'SpiceJet', flightNumber: 'SG-425', source: 'Bangalore', destination: 'Chennai', departure: '19:45', arrival: '21:00', duration: '1h 15m', price: 3500, stops: 'Non-stop', rating: 4.0 },
    { _id: 17, airline: 'Air India', flightNumber: 'AI-912', source: 'Delhi', destination: 'Goa', departure: '06:30', arrival: '09:15', duration: '2h 45m', price: 6800, stops: 'Non-stop', rating: 4.5 },
    { _id: 18, airline: 'IndiGo', flightNumber: '6E-212', source: 'Delhi', destination: 'Goa', departure: '13:00', arrival: '15:45', duration: '2h 45m', price: 5200, stops: 'Non-stop', rating: 4.2 },
    { _id: 19, airline: 'SpiceJet', flightNumber: 'SG-701', source: 'Delhi', destination: 'Goa', departure: '18:45', arrival: '21:30', duration: '2h 45m', price: 4900, stops: 'Non-stop', rating: 4.1 },
    { _id: 20, airline: 'Vistara', flightNumber: 'UK-812', source: 'Delhi', destination: 'Goa', departure: '21:30', arrival: '00:15', duration: '2h 45m', price: 7800, stops: 'Non-stop', rating: 4.7 },
    { _id: 21, airline: 'Air India', flightNumber: 'AI-550', source: 'Hyderabad', destination: 'Delhi', departure: '05:45', arrival: '08:15', duration: '2h 30m', price: 6500, stops: 'Non-stop', rating: 4.4 },
    { _id: 22, airline: 'IndiGo', flightNumber: '6E-406', source: 'Hyderabad', destination: 'Delhi', departure: '10:00', arrival: '12:30', duration: '2h 30m', price: 4800, stops: 'Non-stop', rating: 4.2 },
    { _id: 23, airline: 'SpiceJet', flightNumber: 'SG-602', source: 'Hyderabad', destination: 'Delhi', departure: '14:30', arrival: '17:00', duration: '2h 30m', price: 4500, stops: 'Non-stop', rating: 4.0 },
    { _id: 24, airline: 'Vistara', flightNumber: 'UK-670', source: 'Hyderabad', destination: 'Delhi', departure: '19:15', arrival: '21:45', duration: '2h 30m', price: 7200, stops: 'Non-stop', rating: 4.6 },
    { _id: 25, airline: 'Air India', flightNumber: 'AI-562', source: 'Chennai', destination: 'Delhi', departure: '06:00', arrival: '08:45', duration: '2h 45m', price: 7200, stops: 'Non-stop', rating: 4.4 },
    { _id: 26, airline: 'IndiGo', flightNumber: '6E-105', source: 'Chennai', destination: 'Delhi', departure: '12:30', arrival: '15:15', duration: '2h 45m', price: 5500, stops: 'Non-stop', rating: 4.3 },
    { _id: 27, airline: 'Air India', flightNumber: 'AI-852', source: 'Pune', destination: 'Delhi', departure: '08:00', arrival: '10:30', duration: '2h 30m', price: 6200, stops: 'Non-stop', rating: 4.3 },
    { _id: 28, airline: 'IndiGo', flightNumber: '6E-226', source: 'Pune', destination: 'Delhi', departure: '16:45', arrival: '19:15', duration: '2h 30m', price: 4800, stops: 'Non-stop', rating: 4.1 },
    { _id: 29, airline: 'Air India', flightNumber: 'AI-403', source: 'Kolkata', destination: 'Delhi', departure: '06:30', arrival: '09:00', duration: '2h 30m', price: 6800, stops: 'Non-stop', rating: 4.4 },
    { _id: 30, airline: 'IndiGo', flightNumber: '6E-501', source: 'Kolkata', destination: 'Delhi', departure: '14:00', arrival: '16:30', duration: '2h 30m', price: 5200, stops: 'Non-stop', rating: 4.2 }
  ], []);

  // Filter flights
  const filteredFlights = useMemo(() => {
    let result = allFlights;
    if (searchFrom && searchFrom.trim()) {
      result = result.filter(flight =>
        flight.source.trim().toLowerCase() === searchFrom.trim().toLowerCase()
      );
    }
    if (searchTo && searchTo.trim()) {
      result = result.filter(flight =>
        flight.destination.trim().toLowerCase() === searchTo.trim().toLowerCase()
      );
    }
    return result;
  }, [searchFrom, searchTo, allFlights]);

  // Fallback to all flights if no matches found
  const results = useMemo(() => {
    return filteredFlights.length > 0 ? filteredFlights : allFlights;
  }, [filteredFlights, allFlights]);

  // Sort flights
  const sortedFlights = useMemo(() => {
    let sorted = [...results];
    if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'departure') {
      sorted.sort((a, b) => a.departure.localeCompare(b.departure));
    } else if (sortBy === 'duration') {
      sorted.sort((a, b) => {
        const aMins = parseInt(a.duration.replace('h', '').split(' ')[0]) * 60 + parseInt(a.duration.match(/(\d+)m/)?.[1] || 0);
        const bMins = parseInt(b.duration.replace('h', '').split(' ')[0]) * 60 + parseInt(b.duration.match(/(\d+)m/)?.[1] || 0);
        return aMins - bMins;
      });
    }
    return sorted;
  }, [results, sortBy]);

  const handleBook = (flight) => {
    if (!user) {
      alert('Please login to book a flight');
      navigate('/login');
      return;
    }
    handleBooking(navigate, 'flight', flight);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Summary Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">From</p>
                  <p className="font-bold text-gray-900">{searchFrom || 'Any City'}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 hidden sm:block" />
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">To</p>
                  <p className="font-bold text-gray-900">{searchTo || 'Any City'}</p>
                </div>
              </div>
              {date && (
                <>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                      <p className="font-bold text-gray-900">{date}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              Modify Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Available Flights
              {user?.role === 'admin' && (
                <AdminAddButton label="Add Flight" onClick={() => { setEditingFlight(null); setShowEditModal(true); }} />
              )}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600">{sortedFlights.length} flights found</p>
              {filteredFlights.length === 0 && (searchFrom || searchTo) && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  Showing all routes
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <option value="price">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="departure">Departure Time</option>
              <option value="duration">Fastest Duration</option>
            </select>
          </div>
        </div>

        {/* Flight Cards Grid */}
        {sortedFlights.length > 0 ? (
          <div className="space-y-4">
            {sortedFlights.map((flight) => (
              <div
                key={flight._id}
                className="relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 p-5 sm:p-6"
              >
                {user?.role === 'admin' && (
                  <AdminEditButton onClick={() => handleEdit(flight)} />
                )}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  
                  {/* Column 1: Airline Info */}
                  <div className="flex items-center gap-4 w-full lg:w-1/4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Plane className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{flight.airline}</h3>
                      <p className="text-sm text-gray-500 font-mono">{flight.flightNumber}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-600">{flight.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Journey Timeline */}
                  <div className="flex items-center justify-between w-full lg:w-2/4 px-2 sm:px-6">
                    <div className="text-right flex-1">
                      <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                      <p className="text-sm font-medium text-gray-600">{flight.source}</p>
                    </div>
                    
                    <div className="flex flex-col items-center flex-[2] px-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">{flight.duration}</p>
                      <div className="w-full flex items-center gap-2">
                        <div className="h-[2px] w-full bg-gray-200"></div>
                        <Plane className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="h-[2px] w-full bg-gray-200"></div>
                      </div>
                      <p className="text-xs font-medium text-green-600 mt-2">{flight.stops}</p>
                    </div>

                    <div className="text-left flex-1">
                      <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                      <p className="text-sm font-medium text-gray-600">{flight.destination}</p>
                    </div>
                  </div>

                  {/* Column 3: Pricing & Call to Action */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-1/4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 mt-2 lg:mt-0 gap-4">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-gray-500 mb-1">Per Adult</p>
                      <div className="flex items-center justify-start lg:justify-end gap-1">
                        <IndianRupee className="h-5 w-5 text-gray-900" />
                        <span className="text-2xl font-extrabold text-gray-900">
                          {flight.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBook(flight)}
                      className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Book Now
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any flights matching your criteria. Try adjusting your dates or locations.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Search
            </button>
          </div>
        )}
      </div>
      
      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        serviceType="flight"
        item={editingFlight}
        onSave={(updatedFlight) => {
          // If we had a state for flights, we'd update it here.
          // Since it's useMemo from a constant, we'll just close for now.
          setShowEditModal(false);
        }}
      />
    </div>
  );
};

export default FlightsPage;