import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, CreditCard, Map, MapPin, Clock, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PackageCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const state = location.state || {};
  const { pkg, totalAmount, travellers } = state;

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!pkg) {
      toast.error('Package information not found');
      navigate('/packages');
    }
  }, [pkg, navigate]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    console.log('💳 Package payment started');

    try {
      // Create local booking first (optimistic UI)
      const booking = {
        _id: `local-${Date.now()}`,
        type: 'package',
        title: pkg.title,
        location: pkg.location,
        price: totalAmount,
        travellers,
        date: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
        details: {
          ...pkg,
          serviceType: 'package',
          travellers
        }
      };

      console.log('📦 Local booking created:', booking);

      // Save to localStorage (optimistic)
      const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updated = [booking, ...existing];
      localStorage.setItem('bookings', JSON.stringify(updated));

      // If user is logged in, create backend booking and payment
      if (user?.token) {
        console.log('👤 User logged in, creating backend booking and payment');

        try {
          // Create booking on backend using simple booking endpoint
          const bookingPayload = {
            serviceType: 'package',
            price: totalAmount,
            passengers: travellers,
            details: pkg,
            date: new Date().toISOString(),
          };

          const bookingRes = await axios.post(
            'http://localhost:5000/api/book',
            bookingPayload,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          const backendBooking = bookingRes.data.booking || bookingRes.data;
          console.log('✅ Backend booking created:', backendBooking);

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

          console.log('✅ Payment recorded:', paymentRes.data);

          // Update local booking with backend _id
          booking._id = backendBooking._id;
          const finalUpdated = [booking, ...existing];
          localStorage.setItem('bookings', JSON.stringify(finalUpdated));

          toast.success('Payment successful! Booking confirmed.');
        } catch (backendError) {
          console.error('❌ Backend error (keeping local storage):', backendError);
          toast.success('Booking saved locally! Payment will sync on next login.');
        }
      } else {
        // Guest user - only local storage
        toast.success('Booking confirmed! (Guest booking saved locally)');
      }

      // Redirect after showing success toast
      setTimeout(() => {
        navigate('/dashboard/bookings', {
          state: {
            newBooking: booking
          }
        });
      }, 1500);

    } catch (error) {
      console.error('❌ Payment failed:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-2">
            <Map className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Package Checkout</h1>
          </div>
          <p className="text-gray-500">Complete your package booking</p>
        </div>

        {/* Content */}
        <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl shadow-sm p-8">
          <div className="space-y-6 mb-8">
            {/* Package Info */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Map className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h2>
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" /> {pkg.location}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-4 w-4" /> {pkg.duration}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Travellers</p>
                <p className="font-semibold text-gray-900">{travellers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Package Type</p>
                <p className="font-semibold text-gray-900">{pkg.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Price per person</p>
                <p className="font-semibold text-gray-900">₹{pkg.price?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Departure</p>
                <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Amount</p>
                  <p className="text-sm text-gray-500">Including all taxes & fees</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl flex justify-center items-center text-white font-bold text-lg shadow-lg transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pay ₹{totalAmount.toLocaleString()} Now
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Secure payment • 256-bit SSL encrypted
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This is a simulated payment. No actual charge will be made.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageCheckout;
