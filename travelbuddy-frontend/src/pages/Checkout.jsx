import React, { useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, CreditCard, Plane, Hotel, Train, CarTaxiFront, Package, Map } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  return icons[type] || Package;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price || 0);
};

const Checkout = () => {
  // Get location and state at top level
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Safe data extraction
  const state = location.state || {};
  console.log("🔥 Checkout received state:", state);
  const type = state.type || "hotel"; // default to hotel for safer fallback
  const data = state.data || {};
  const passengers = state.passengers || 1;
  console.log("🔥 Checkout data:", data, "passengers:", passengers);

  // Safe field handling with optional chaining
  const basePrice = useMemo(() =>
    data?.price ||
    data?.fare ||
    data?.amount ||
    4999,
  [data]);

  // Total amount calculation (flights and trains are per person)
  const totalAmount = useMemo(() => {
    if (type === 'flight' || type === 'train') {
      return basePrice * passengers;
    }
    return basePrice; // for cabs, hotels, packages - fixed price
  }, [basePrice, passengers, type]);

  const title = useMemo(() =>
    data?.name ||
    data?.title ||
    data?.airline ||
    "Booking",
  [data]);

  const from = useMemo(() =>
    data?.from ||
    data?.source ||
    data?.pickup ||
    data?.location ||
    "",
  [data]);

  const to = useMemo(() =>
    data?.to ||
    data?.destination ||
    data?.drop ||
    "",
  [data]);

  console.log("🔥 Checkout Data:", { type, data, basePrice, totalAmount, title, from, to, passengers });

  const ServiceIcon = getServiceIcon(type);

  // Payment handler with backend integration
  const handlePayment = async () => {
    console.log("🔥 Pay button clicked");

    try {
      // Step 1: Save booking to localStorage (optimistic UI)
      const booking = {
        _id: `local-${Date.now()}`,
        type,
        title,
        from,
        to,
        location: data?.location || data?.city || "Unknown Location",
        price: totalAmount,
        basePrice,
        passengers,
        date: new Date().toISOString(),
        status: "Confirmed",
        details: data,
      };

      console.log("📦 Booking object (local):", booking);
      const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
      const updated = [booking, ...existing];
      localStorage.setItem("bookings", JSON.stringify(updated));

      // Step 2: If user is logged in, create backend booking and payment
      if (user?.token) {
        console.log("👤 User logged in, creating backend booking and payment");

        try {
          // Create booking on backend using the simple booking endpoint
          const bookingPayload = {
            serviceType: type,
            price: totalAmount,
            passengers,
            details: data,
            date: new Date().toISOString(),
          };

          const bookingRes = await axios.post(
            'http://localhost:5000/api/book',
            bookingPayload,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          // Extract booking from response structure: { success: true, message: '...', booking: {...} }
          const backendBooking = bookingRes.data.booking || bookingRes.data;
          console.log("✅ Backend booking created:", backendBooking);

          if (!backendBooking._id) {
            throw new Error('Backend booking did not return an _id');
          }

          // Create payment record
          const paymentPayload = {
            bookingId: backendBooking._id,
            amount: totalAmount,
            paymentMethod: 'SimulatedGateway',
          };

          const paymentRes = await axios.post(
            'http://localhost:5000/api/payments/pay',
            paymentPayload,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          console.log("✅ Payment recorded:", paymentRes.data);

          // Update local booking with backend _id to keep sync
          booking._id = backendBooking._id;
          const finalUpdated = [booking, ...existing];
          localStorage.setItem("bookings", JSON.stringify(finalUpdated));

          toast.success('Payment successful! Booking confirmed.');
        } catch (backendError) {
          console.error("❌ Backend error (keeping local storage):", backendError);
          toast.success('Booking saved locally! Payment will sync on next login.');
        }
      } else {
        // Guest user - only local storage
        toast.success('Booking confirmed! (Guest booking saved locally)');
      }

      // Redirect after a short delay to show success
      setTimeout(() => {
        navigate('/dashboard/bookings', {
          state: {
            newBooking: {
              type: type,
              title: title,
              from: from,
              to: to,
              date: new Date().toISOString().split('T')[0],
              price: totalAmount,
              status: 'confirmed',
              details: {
                ...data,
                serviceType: type,
                passengers
              }
            }
          }
        });
      }, 1500);

    } catch (error) {
      console.error("❌ Payment Crash:", error);
      toast.error("Payment failed - check console for details");
    }
  };

  // Dynamic summary fields based on type
  const renderDetails = () => {
    switch (type) {
      case 'flight':
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Route</span>
              <span className="font-medium">{from} → {to}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Airline</span>
              <span className="font-medium">{data?.airline}</span>
            </div>
            {data?.flightNumber && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Flight</span>
                <span className="font-medium">{data.flightNumber}</span>
              </div>
            )}
            {data?.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{data.duration}</span>
              </div>
            )}
          </>
        );

      case 'hotel':
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Hotel</span>
              <span className="font-medium text-right max-w-[200px] truncate">{title}</span>
            </div>
            {data?.location && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{data.location}</span>
              </div>
            )}
            {data?.rating && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Rating</span>
                <span className="font-medium">{data.rating} ★</span>
              </div>
            )}
          </>
        );

      case 'train':
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Train</span>
              <span className="font-medium">{data?.trainName || title}</span>
            </div>
            {data?.trainNumber && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Train No.</span>
                <span className="font-medium">{data.trainNumber}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Route</span>
              <span className="font-medium">{from} → {to}</span>
            </div>
            {data?.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{data.duration}</span>
              </div>
            )}
          </>
        );

      case 'cab':
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Route</span>
              <span className="font-medium">{from} → {to}</span>
            </div>
            {data?.cabType && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Cab Type</span>
                <span className="font-medium capitalize">{data.cabType}</span>
              </div>
            )}
          </>
        );

      case 'package':
      case 'tour':
        return (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Package</span>
              <span className="font-medium text-right max-w-[200px] truncate">{title}</span>
            </div>
            {data?.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{data.duration}</span>
              </div>
            )}
            {data?.destination && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Destination</span>
                <span className="font-medium">{data.destination}</span>
              </div>
            )}
          </>
        );

      default:
        return (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Service</span>
            <span className="font-medium capitalize">{type}</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Secure Checkout</h1>
            <p className="text-gray-300 mt-1">Review your booking details</p>
          </div>
          <ShieldCheck className="h-10 w-10 text-green-400" />
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Details Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Service</span>
                <div className="flex items-center space-x-2">
                  <ServiceIcon className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-gray-900 capitalize">{type}</span>
                </div>
              </div>

              {renderDetails()}

              {/* Show per-person price breakdown for flights/trains with multiple passengers */}
              {(type === 'flight' || type === 'train') && passengers > 1 && (
                <div className="text-right text-sm text-gray-500">
                  {formatPrice(basePrice)} × {passengers} passengers = {formatPrice(totalAmount)}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                <span className="text-blue-600 font-bold text-2xl">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-gray-500"/>
              Payment Details
            </h3>

            <div className="space-y-4 mb-8 text-gray-600 text-sm">
              <p className="bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-100">
                This is a simulated payment gateway. Clicking "Pay Now" will confirm your booking.
              </p>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-4 rounded-xl flex justify-center items-center text-white font-bold text-lg shadow-md transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Pay {formatPrice(totalAmount)} Now
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 mr-1" /> Payments are secure and encrypted
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
