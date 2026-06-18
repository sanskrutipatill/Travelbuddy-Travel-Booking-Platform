import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Car, Calendar, Star, ArrowRight, Edit2, Trash2, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { handleBooking } from '../utils/handleBooking';
import EditServiceModal from '../components/EditServiceModal';
import axios from 'axios';

const CabsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const pickup = searchParams.get('source') || '';
  const drop = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers')) || 1;

  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCab, setEditingCab] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCabs();
  }, [pickup, drop]);

  const fetchCabs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (pickup) params.pickup = pickup;
      if (drop) params.drop = drop;

      const res = await axios.get('http://localhost:5000/api/cabs', { params });
      setCabs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cabs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cab) => {
    setEditingCab(cab);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cab?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/admin/service/cab/${id}`, config);
      toast.success('Cab deleted successfully');
      fetchCabs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{pickup || 'City Center'}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{drop || 'Airport'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
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
            <h1 className="text-2xl font-bold text-gray-900">Available Cabs</h1>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Loading...' : `${cabs.length} cabs found`}
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchCabs} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
          </div>
        )}

        {/* Cab Cards */}
        {!error && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : cabs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No cabs found matching your criteria.</p>
              </div>
            ) : (
              cabs.map((cab, index) => (
                <div
                  key={cab._id || index}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 relative group"
                >
                  {/* Admin badge */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded uppercase">Admin</span>
                    </div>
                  )}

                  {/* Admin buttons */}
                  {isAdmin && (
                    <div className="absolute top-3 right-16 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(cab)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-md transition-colors"
                        title="Edit Cab"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cab._id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                        title="Delete Cab"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Cab Info */}
                    <div className="flex items-center space-x-4 lg:w-1/4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                        <Car className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{cab.model}</h3>
                        <p className="text-sm text-gray-500">{cab.type}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{cab.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Route & Time */}
                    <div className="flex items-center space-x-8 lg:w-2/4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{cab.departure}</p>
                        <p className="text-sm text-gray-600">{pickup}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-1">{cab.duration}</p>
                        <div className="relative w-full">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200"></div>
                          <ArrowRight className="relative top-1/2 left-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 bg-white" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{cab.type}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{cab.arrival}</p>
                        <p className="text-sm text-gray-600">{drop}</p>
                      </div>
                    </div>

                    {/* Right: Price & Book */}
                    <div className="lg:w-1/4 flex items-center justify-between lg:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">{cab.type} Fare</p>
                        <div className="flex items-center justify-end space-x-1">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                          <span className="text-2xl font-bold text-gray-900">{cab.price?.toLocaleString('en-IN') || '0'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBooking(navigate, 'cab', cab, { passengers })}
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
        onClose={() => { setShowModal(false); setEditingCab(null); }}
        serviceType="cab"
        item={editingCab}
        onSave={(updatedCab) => {
          setCabs(prev => prev.map(t => ((t._id || t.id) === (updatedCab._id || updatedCab.id) && (t._id || t.id)) ? updatedCab : t));
          setShowModal(false);
          setEditingCab(null);
        }}
      />
    </div>
  );
};

export default CabsPage;
