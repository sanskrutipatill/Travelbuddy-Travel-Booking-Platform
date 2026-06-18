import React from 'react';
import {
  Plane,
  Hotel,
  Train,
  CarTaxiFront,
  Package,
  Map,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
} from 'lucide-react';

const BookingTable = ({ bookings, loading, onCancel, showActions = true }) => {
  // Normalize booking structure: support both backend (serviceType) and localStorage (type)
  const normalizeBooking = (booking) => {
    const serviceType = booking.serviceType || booking.type || 'unknown';
    const details = booking.details || {};
    return {
      ...booking,
      // Ensure _id exists for React key
      _id: booking._id || booking.id || `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      serviceType,
      // Extract common fields from details if not at top level
      title: booking.title || details.name || details.title || details.hotelName || details.destination || 'Booking',
      from: booking.from || details.source || details.pickup || details.location || '',
      to: booking.to || details.destination || details.drop || '',
      location: booking.location || details.location || details.city || '',
      price: booking.price || details.price || 0,
    };
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          border: 'border-emerald-100',
          label: 'Confirmed',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          bg: 'bg-red-50',
          text: 'text-red-600',
          border: 'border-red-100',
          label: 'Cancelled',
        };
      case 'pending':
        return {
          icon: Clock,
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          border: 'border-amber-100',
          label: 'Pending',
        };
      default:
        return {
          icon: Clock,
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200',
          label: status || 'Unknown',
        };
    }
  };

  const getServiceIcon = (type) => {
    const icons = {
      flight: Plane,
      hotel: Hotel,
      train: Train,
      cab: CarTaxiFront,
      package: Package,
      tour: Map,
      destination: Map,
    };
    return icons[type?.toLowerCase()] || Plane;
  };

  const getServiceColor = (type) => {
    const colors = {
      flight: 'from-indigo-400 to-blue-500',
      hotel: 'from-emerald-400 to-teal-500',
      train: 'from-purple-400 to-indigo-500',
      cab: 'from-orange-400 to-amber-500',
      package: 'from-rose-400 to-red-500',
      tour: 'from-amber-400 to-yellow-500',
      destination: 'from-teal-400 to-green-500',
    };
    return colors[type?.toLowerCase()] || 'from-gray-400 to-gray-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading your bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 bg-white rounded-3xl border border-gray-100">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="h-12 w-12 text-gray-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 max-w-sm">
            Start planning your next adventure! Book flights, hotels, trains, or cabs to explore the world.
          </p>
        </div>
      </div>
    );
  }

  // Normalize all bookings to consistent structure
  const normalizedBookings = bookings.map(normalizeBooking);

  return (
    <div className="space-y-4">
      {normalizedBookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.status);
        const ServiceIcon = getServiceIcon(booking.serviceType);
        const serviceColors = getServiceColor(booking.serviceType);

        return (
          <div
            key={booking._id}
            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-blue-100 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Service Info */}
              <div className="flex items-start space-x-4 flex-1">
                <div
                  className={`p-3 bg-gradient-to-br ${serviceColors} rounded-xl shadow-lg shadow-gray-300/20 group-hover:scale-110 transition-transform duration-300`}
                >
                  <ServiceIcon className="h-6 w-6 text-white" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r ${serviceColors} text-white`}
                    >
                      {booking.serviceType}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                    >
                      <statusConfig.icon className="h-4 w-4" />
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {booking.serviceType === 'hotel'
                      ? (booking.location || booking.title)
                      : booking.serviceType === 'train'
                      ? `${booking.title}${booking.details?.trainNumber ? ` (${booking.details.trainNumber})` : ''}`
                      : booking.serviceType === 'cab'
                      ? `${booking.from} → ${booking.to}`
                      : booking.serviceType === 'flight'
                      ? `${booking.from} → ${booking.to}`
                      : booking.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    {booking.details?.airline && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {booking.details.airline}
                      </span>
                    )}
                    {booking.details?.cabType && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {booking.details.cabType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Price & Actions */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Total Price
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{booking.price?.toLocaleString()}
                  </p>
                </div>

                {showActions && booking.status !== 'cancelled' && (
                  <button
                    onClick={() => onCancel?.(booking)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingTable;
