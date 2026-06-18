import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ShieldCheck, CreditCard, Train } from 'lucide-react';

const TrainCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  if (!state || !state.train) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <Train className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Train Selected</h2>
          <p className="text-gray-600 mb-6">Please select a train to proceed with booking.</p>
          <button
            onClick={() => navigate('/trains')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Trains
          </button>
        </div>
      </div>
    );
  }

  const train = state.train;
  const travelDate = state.date || new Date().toISOString().split('T')[0];
  const passengers = state.passengers || 1;

  // Calculate total amount (train price per person * passengers)
  const basePrice = train.price;
  const totalAmount = basePrice * passengers;

  const handlePayment = async () => {
    setLoading(true);
    console.log('🚂 Train Checkout - Payment initiated', {
      train,
      passengers,
      totalAmount,
      travelDate,
      user: user?._id
    });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // 1. Create booking
      const bookingData = {
        serviceType: 'train',
        price: totalAmount,
        date: travelDate,
        passengers,
        details: train // Include full train details for reference
      };
      console.log('📦 Booking payload:', bookingData);

      const bookingRes = await axios.post('http://localhost:5000/api/book', bookingData, config);
      console.log('📋 Booking response:', bookingRes.data);
      // Extract booking from response: { success: true, booking: {...} } or just the booking object
      const backendBooking = bookingRes.data.booking || bookingRes.data;

      if (!backendBooking._id) {
        console.error('❌ No _id in booking response:', backendBooking);
        throw new Error('Backend booking did not return an _id');
      }
      console.log('✅ Booking created with ID:', backendBooking._id);

      // 2. Process simulated payment
      const paymentData = {
        bookingId: backendBooking._id,
        amount: totalAmount,
        paymentMethod: 'Credit Card'
      };
      console.log('💳 Payment payload:', paymentData);

      const paymentRes = await axios.post('http://localhost:5000/api/payments/pay', paymentData, config);
      console.log('💳 Payment response:', paymentRes.data);

      if (paymentRes.data.status === 'Success') {
        toast.success('Train Booking Confirmed & Payment Successful!');
        // Redirect with booking data
        navigate('/dashboard/bookings', {
          state: {
            newBooking: {
              type: 'train',
              title: train.trainName || train.name,
              from: train.source,
              to: train.destination,
              date: travelDate,
              price: totalAmount,
              status: 'confirmed',
              details: {
                ...train,
                serviceType: 'train',
                passengers,
                trainNumber: train.trainNumber,
                class: train.class
              }
            }
          }
        });
      } else {
        toast.error('Payment Failed! Booking is pending.');
        navigate('/dashboard');
      }

    } catch (error) {
      toast.error('An error occurred during checkout.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Train className="h-6 w-6" />
              Train Checkout
            </h1>
            <p className="text-gray-300 mt-1">Review your train booking details</p>
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
                <span className="font-semibold text-gray-900">Train Booking</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Train</span>
                <span className="font-medium">{train.trainName || train.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Train Number</span>
                <span className="font-medium">{train.trainNumber}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Route</span>
                <span className="font-medium">{train.source} → {train.destination}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Departure</span>
                <span className="font-medium">{train.departure}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Arrival</span>
                <span className="font-medium">{train.arrival}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{train.duration}</span>
              </div>

              {train.stops && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Stops</span>
                  <span className="font-medium">{train.stops}</span>
                </div>
              )}

              {train.class && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Class</span>
                  <span className="font-medium">{train.class}</span>
                </div>
              )}

              {/* Show per-person price breakdown for multiple passengers */}
              {passengers > 1 && (
                <div className="text-right text-sm text-gray-500">
                  ₹{basePrice.toLocaleString('en-IN')} × {passengers} passengers = ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                <span className="text-blue-600 font-bold text-2xl">₹{totalAmount.toLocaleString('en-IN')}</span>
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
                This is a simulated payment gateway. Clicking "Pay Now" has an 80% chance of succeeding. Real money will not be deducted.
              </p>

              <div>
                 <label className="block text-xs font-semibold uppercase mb-1">Card Number (Mock)</label>
                 <input id="card-number-mock" name="cardNumber" type="text" disabled value="**** **** **** 4242" className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-md font-mono text-gray-500" />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 rounded-xl flex justify-center items-center text-white font-bold text-lg shadow-md transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="animate-pulse">Processing Payment...</span>
              ) : (
                `Pay ₹${totalAmount.toLocaleString('en-IN')} Now`
              )}
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

export default TrainCheckout;
