import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Users, FileText, DollarSign, Settings, Bell,
  Plane, Building, Train, Car, Gift, Plus, Edit2, Trash2,
  Shield, RefreshCw, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import EditServiceModal from '../components/EditServiceModal';

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, revenue: 0, serviceCounts: {} });
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState({ flights: [], hotels: [], trains: [], cabs: [], packages: [] });
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
      setStats(statsRes.data);

      const bookingsRes = await axios.get('http://localhost:5000/api/admin/bookings', config);
      setBookings(bookingsRes.data);

      // Fetch all services
      const [flights, hotels, trains, cabs, packages] = await Promise.all([
        axios.get('http://localhost:5000/api/flights', config),
        axios.get('http://localhost:5000/api/hotels', config),
        axios.get('http://localhost:5000/api/trains', config),
        axios.get('http://localhost:5000/api/cabs', config),
        axios.get('http://localhost:5000/api/packages', config),
      ]);

      setServices({
        flights: flights.data,
        hotels: hotels.data,
        trains: trains.data,
        cabs: cabs.data,
        packages: packages.data,
      });
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchDashboardData();
  }, [isAdmin]);

  const updateBookingStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/admin/bookings/${id}/status`, { status }, config);
      toast.success(`Booking marked as ${status}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (tabType, item) => {
    setEditingType(getServiceType(tabType));
    setEditingService(item);
    setShowModal(true);
  };

  const handleDelete = async (tabType, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const serviceType = getServiceType(tabType);
      await axios.delete(`http://localhost:5000/api/admin/service/${serviceType}/${id}`, config);
      toast.success('Deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  // Map plural tab IDs to singular service types for API
  const getServiceType = (tabId) => {
    const map = { flights: 'flight', hotels: 'hotel', trains: 'train', cabs: 'cab', packages: 'package' };
    return map[tabId] || tabId;
  };

  const handleAddNew = (type) => {
    setEditingType(getServiceType(type));
    setEditingService(null); // null means create new
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingService(null);
    setEditingType('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'flights', label: 'Flights', icon: Plane, count: services.flights.length },
    { id: 'hotels', label: 'Hotels', icon: Building, count: services.hotels.length },
    { id: 'trains', label: 'Trains', icon: Train, count: services.trains.length },
    { id: 'cabs', label: 'Cabs', icon: Car, count: services.cabs.length },
    { id: 'packages', label: 'Packages', icon: Gift, count: services.packages.length },
    { id: 'bookings', label: 'Bookings', icon: FileText, count: bookings.length },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const renderServiceTable = (type, items, columns) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 capitalize">{type} Management</h3>
        <button
          onClick={() => handleAddNew(type)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.slice(0, 20).map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {col.render ? col.render(item[col.key], item) : String(item[col.key] || '-')}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(type, item)} className="text-yellow-600 hover:text-yellow-900 p-2">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(type, item._id)} className="text-red-600 hover:text-red-900 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-yellow-500" /> Admin Control Panel
          </h1>
          <p className="text-gray-500">Welcome back, {user?.name} (Admin)</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalBookings}</h3>
                    </div>
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.revenue?.toLocaleString('en-IN') || 0}</h3>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-sm text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-blue-100">Active Services</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {(stats.serviceCounts?.flights || 0) + (stats.serviceCounts?.hotels || 0) + (stats.serviceCounts?.trains || 0) + (stats.serviceCounts?.cabs || 0) + (stats.serviceCounts?.packages || 0)}
                      </h3>
                    </div>
                    <Settings className="h-8 w-8 text-blue-200" />
                  </div>
                </div>
              </div>

              {/* Service Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Service Inventory</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Flights', count: stats.serviceCounts?.flights || 0, icon: Plane, color: 'text-blue-600' },
                    { label: 'Hotels', count: stats.serviceCounts?.hotels || 0, icon: Building, color: 'text-green-600' },
                    { label: 'Trains', count: stats.serviceCounts?.trains || 0, icon: Train, color: 'text-orange-600' },
                    { label: 'Cabs', count: stats.serviceCounts?.cabs || 0, icon: Car, color: 'text-purple-600' },
                    { label: 'Packages', count: stats.serviceCounts?.packages || 0, icon: Gift, color: 'text-pink-600' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 bg-gray-50 rounded-lg text-center">
                      <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                      <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800">All Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.userId?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{booking.userId?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{booking.serviceType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{booking.price?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {booking.status !== 'cancelled' && (
                            <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="text-red-600 hover:text-red-900 p-2">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status === 'pending' && (
                            <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="text-green-600 hover:text-green-900 p-2">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Service Tabs */}
          {['flights', 'hotels', 'trains', 'cabs', 'packages'].map((type) => {
            if (activeTab !== type) return null;
            const items = services[type] || [];
            const configs = {
              flights: {
                icon: Plane,
                columns: [
                  { key: 'airline', label: 'Airline' },
                  { key: 'flightNumber', label: 'Flight No' },
                  { key: 'source', label: 'From' },
                  { key: 'destination', label: 'To' },
                  { key: 'price', label: 'Price', render: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
                  { key: 'departureTime', label: 'Departs' },
                ],
              },
              hotels: {
                icon: Building,
                columns: [
                  { key: 'name', label: 'Hotel Name' },
                  { key: 'location', label: 'Location' },
                  { key: 'propertyType', label: 'Type' },
                  { key: 'price', label: 'Price/Night', render: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
                  { key: 'rating', label: 'Rating' },
                ],
              },
              trains: {
                icon: Train,
                columns: [
                  { key: 'trainName', label: 'Train Name' },
                  { key: 'trainNumber', label: 'Train No' },
                  { key: 'source', label: 'From' },
                  { key: 'destination', label: 'To' },
                  { key: 'class', label: 'Class' },
                  { key: 'price', label: 'Fare', render: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
                ],
              },
              cabs: {
                icon: Car,
                columns: [
                  { key: 'model', label: 'Car Model' },
                  { key: 'cabType', label: 'Type' },
                  { key: 'pickup', label: 'Pickup' },
                  { key: 'drop', label: 'Drop' },
                  { key: 'price', label: 'Price', render: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
                ],
              },
              packages: {
                icon: Gift,
                columns: [
                  { key: 'title', label: 'Title' },
                  { key: 'location', label: 'Location' },
                  { key: 'type', label: 'Type' },
                  { key: 'price', label: 'Price', render: (val) => `₹${(val || 0).toLocaleString('en-IN')}` },
                  { key: 'duration', label: 'Duration' },
                ],
              },
            };
            const config = configs[type];
            return (
              <div key={type}>
                {renderServiceTable(type, items, config.columns)}
              </div>
            );
          })}
        </>
      )}

      {/* Edit/Create Modal */}
      <EditServiceModal
        isOpen={showModal}
        onClose={handleModalClose}
        serviceType={editingType}
        item={editingService}
        onSave={fetchDashboardData}
      />
    </div>
  );
};

export default AdminDashboard;
