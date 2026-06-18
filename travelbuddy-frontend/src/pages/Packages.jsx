import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Users, Star, Calendar, ArrowRight, Edit2, Trash2, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { handleBooking } from '../utils/handleBooking';
import EditServiceModal from '../components/EditServiceModal';
import axios from 'axios';

const PackagesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passengers = searchParams.get('passengers') || '1';
  const { user, isAdmin } = useContext(AuthContext);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPkg, setEditingPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/packages');
      setPackages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPkg(pkg);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/admin/service/package/${id}`, config);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Holiday Packages</h1>
            <p className="text-sm text-gray-500 mt-1">All-inclusive tour packages for every traveler</p>
          </div>
          {isAdmin && (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
              <Shield className="w-3 h-3" /> ADMIN
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchPackages} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
          </div>
        )}

        {/* Package Cards */}
        {!error && (
          loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No packages found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packages.map((pkg, index) => (
                <div
                  key={pkg._id || index}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden group relative cursor-pointer"
                  onClick={() => navigate(`/package-details?passengers=${passengers}`, { state: { pkg } })}
                >
                  {/* Edit Icon for Admin */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(pkg);
                      }}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
                    >
                      ✏️
                    </button>
                  )}

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image || 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }}
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                      {pkg.type || 'Package'}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-gray-900 flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{pkg.title}</h3>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>{pkg.location}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-gray-400 mb-3">
                      <Clock className="h-3 w-3" />
                      <span>{pkg.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(pkg.highlights || []).slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <p className="text-xs text-gray-400 line-through">₹{(pkg.originalPrice || 0).toLocaleString('en-IN')}</p>
                        )}
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-3 w-3 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">{(pkg.price || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">per person</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBooking(navigate, 'package', pkg);
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center space-x-1"
                      >
                        <span>Book</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Edit Modal */}
      <EditServiceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingPkg(null); }}
        serviceType="package"
        item={editingPkg}
        onSave={(updatedPkg) => {
          setPackages(prev => prev.map(t => ((t._id || t.id) === (updatedPkg._id || updatedPkg.id) && (t._id || t.id)) ? updatedPkg : t));
          setShowModal(false);
          setEditingPkg(null);
        }}
      />
    </div>
  );
};

export default PackagesPage;
