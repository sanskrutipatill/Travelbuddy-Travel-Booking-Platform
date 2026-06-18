import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CollapsibleSidebar from '../components/CollapsibleSidebar';
import DashboardOverview from './DashboardOverview';
import MyBookings from './MyBookings';
import UpcomingTrips from './UpcomingTrips';
import Payments from './Payments';
import Profile from './Profile';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [user]);

  // Refetch when new booking arrives via navigation state
  useEffect(() => {
    if (location.state?.newBooking && user?.token) {
      fetchBookings();
    }
  }, [location.state, user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (idOrBooking) => {
    try {
      // Support both id string and booking object
      const id = typeof idOrBooking === 'string' ? idOrBooking : (idOrBooking._id || idOrBooking.id);
      if (!id) {
        toast.error('Cannot cancel: missing booking ID');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/bookings/cancel/${id}`, {}, config);
      toast.success(
        <div>
          <p className="font-semibold">Your booking has been successfully cancelled.</p>
          <p className="text-sm mt-1">The refund will be processed as per the applicable policy.</p>
        </div>,
        { autoClose: 5000 }
      );
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error(error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CollapsibleSidebar />

      <main className="xl:ml-64 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Routes>
            <Route index element={<DashboardOverview bookings={bookings} user={user} loading={loading} onCancel={cancelBooking} />} />
            <Route path="overview" element={<DashboardOverview bookings={bookings} user={user} loading={loading} onCancel={cancelBooking} />} />
            <Route path="bookings" element={<MyBookings bookings={bookings} loading={loading} onCancel={cancelBooking} />} />
            <Route path="upcoming" element={<UpcomingTrips bookings={bookings} loading={loading} />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;