import React, { useEffect, useMemo, useState } from 'react';
import BookingTable from '../components/BookingTable';

const UpcomingTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bookings')) || [];
      setBookings(stored);
    } catch (error) {
      console.error('Error loading bookings from localStorage:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const upcomingTrips = useMemo(() => {
    const today = new Date();
    const todayDateOnly = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return bookings
      .filter((booking) => {
        const isConfirmed = booking.status === 'Confirmed';
        const bookingDate = typeof booking.date === 'string' ? booking.date : new Date(booking.date).toISOString().split('T')[0];
        const isFutureOrToday = bookingDate >= todayDateOnly;
        return isConfirmed && isFutureOrToday;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [bookings]);

  // Debug: Log to understand data
  useEffect(() => {
    console.log('🔍 UpcomingTrips Debug:', {
      totalBookings: bookings.length,
      upcomingCount: upcomingTrips.length,
      today: new Date().toISOString().split('T')[0],
      upcomingIds: upcomingTrips.map(b => b._id),
      sampleBookings: bookings.slice(0, 3).map(b => ({
        id: b._id,
        type: b.type || b.serviceType,
        status: b.status,
        date: b.date,
        dateType: typeof b.date
      }))
    });
  }, [bookings, upcomingTrips]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Trips</h1>
        <p className="text-gray-500 mt-1">Your confirmed upcoming travel plans</p>
      </div>

      <BookingTable
        bookings={upcomingTrips}
        loading={loading}
        onCancel={undefined}
        showActions={false}
      />
    </div>
  );
};

export default UpcomingTrips;
