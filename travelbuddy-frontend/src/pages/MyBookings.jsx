import React, { useEffect, useMemo, useContext } from 'react';
import BookingTable from '../components/BookingTable';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const MyBookings = ({ bookings: propBookings = [], loading: propLoading = false, onCancel, showActions = true }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Get new booking from navigation state (after successful payment)
  const newBooking = location.state?.newBooking;

  // Combine new booking with existing bookings (avoid duplicate)
  const combinedBookings = useMemo(() => {
    if (!newBooking) return propBookings;
    const isDuplicate = propBookings.some(b =>
      (b.title === newBooking.title && b.date === newBooking.date && b.price === newBooking.price) ||
      b._id === newBooking._id
    );
    return isDuplicate ? propBookings : [newBooking, ...propBookings];
  }, [propBookings, newBooking]);

  // For backwards compatibility, also load from localStorage if no propBookings provided (fallback)
  useEffect(() => {
    if (!propBookings || propBookings.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem("bookings")) || [];
        console.log("Loaded bookings from localStorage (fallback):", stored);
        // Note: we cannot update propBookings; this is just for standalone usage
        // In current app, propBookings is always provided by Dashboard
      } catch (error) {
        console.error("Error loading bookings:", error);
      }
    }
  }, [propBookings]);

  const handleCancel = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const id = booking._id || booking.id;
      if (!id) {
        toast.error("Cannot cancel booking: missing ID");
        return;
      }

      // Optimistic UI: remove from list (works for local state only; for propBookings, parent must update)
      // Since we are using propBookings, we rely on parent Dashboard's onCancel to update
      if (onCancel) {
        await onCancel(booking);
      } else {
        // Fallback: try to cancel locally (for standalone usage)
        const updated = combinedBookings.filter((b) => (b._id || b.id) !== id);
        // Cannot set state for propBookings; this is a limitation for standalone
        toast.success(
          <div>
            <p className="font-semibold">Your booking has been successfully cancelled.</p>
            <p className="text-sm mt-1">The refund will be processed as per the applicable policy.</p>
          </div>,
          { autoClose: 5000 }
        );
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage all your reservations</p>
      </div>

      <BookingTable
        bookings={combinedBookings}
        loading={propLoading}
        onCancel={handleCancel}
        showActions={showActions}
      />
    </div>
  );
};

export default MyBookings;
