import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, MapPin, Clock, IndianRupee, ArrowRight, Filter, Star, Edit2, Trash2, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { handleBooking } from '../utils/handleBooking';
import EditServiceModal from '../components/EditServiceModal';
import axios from 'axios';

const FlightsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers')) || 1;

  // State
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingFlight, setEditingFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch flights on mount
  useEffect(() => {
    fetchFlights();
  }, [source, destination, date]);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (source) params.source = source;
      if (destination) params.destination = destination;
      if (date) params.date = date;

      const res = await axios.get('http://localhost:5000/api/flights', { params });
      console.log('Fetched flights:', res.data);
      setFlights(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch flights');
      console.error('Error fetching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/admin/service/flight/${id}`, config);
      toast.success('Flight deleted successfully');
      fetchFlights();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleUpdateFlight = async (formData) => {
    try {
      console.log("SUBMIT CLICKED");

      const payload = {
        ...formData,
        price: Number(formData.price),
        stops: Number(formData.stops)
      };

      // Remove immutable MongoDB fields from payload so findByIdAndUpdate does not fail
      delete payload._id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;

      console.log("Payload before API call:", payload);

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put(`http://localhost:5000/api/admin/service/flight/${formData._id}`, payload, config);

      console.log("API response:", res.data);

      toast.success('Flight updated successfully');
      setFlights(flights.map(f => f._id === formData._id ? { ...f, ...formData } : f));
      
      setShowModal(false);
      setEditingFlight(null);
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response?.data?.message || 'Failed to update flight');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{source || 'Delhi'}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{destination || 'Mumbai'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{date || 'Select date'}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Modify Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Available Flights</h1>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Loading...' : `${flights.length} flights found`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                <Shield className="w-3 h-3" /> ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Status messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchFlights} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Retry
            </button>
          </div>
        )}

        {/* Flight Cards */}
        {!error && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : flights.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No flights found matching your criteria.</p>
              </div>
            ) : (
              flights.map((flight, index) => (
                <div
                  key={flight._id || index}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 relative group"
                >
                  {/* Admin badge on card */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">
                        Admin
                      </span>
                    </div>
                  )}

                  {/* Admin buttons (top-right) */}
                  {isAdmin && (
                    <div className="absolute top-3 right-16 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(flight)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-md transition-colors"
                        title="Edit Flight"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(flight._id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                        title="Delete Flight"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Airline Info */}
                    <div className="flex items-center space-x-4 lg:w-1/4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                        <Plane className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{flight.airline}</h3>
                        <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{flight.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Route & Time */}
                    <div className="flex items-center space-x-8 lg:w-2/4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{flight.departureTime}</p>
                        <p className="text-sm text-gray-600">{flight.source}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-1">{flight.duration}</p>
                        <div className="relative w-full">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200"></div>
                          <ArrowRight className="relative top-1/2 left-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 bg-white" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{flight.arrivalTime}</p>
                        <p className="text-sm text-gray-600">{flight.destination}</p>
                      </div>
                    </div>

                    {/* Right: Price & Book */}
                    <div className="lg:w-1/4 flex items-center justify-between lg:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Price per person</p>
                        <div className="flex items-center justify-end space-x-1">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                          <span className="text-2xl font-bold text-gray-900">
                            {flight.price?.toLocaleString('en-IN') || '0'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!user) {
                            alert('Please login to book a flight');
                            navigate('/login');
                            return;
                          }
                          handleBooking(navigate, 'flight', flight, { passengers });
                        }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Edit Modal */}
      <EditServiceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingFlight(null); }}
        serviceType="flight"
        item={editingFlight}
        onSave={handleUpdateFlight}
      />
    </div>
  );
};

export default FlightsPage;
