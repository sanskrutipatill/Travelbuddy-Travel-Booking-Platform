import React, { useState, useEffect, useContext } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, IndianRupee, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Payments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching payments for user:', user._id);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/payments/my-payments', config);
        console.log('✅ Payments fetched:', data);
        setPayments(data || []);
      } catch (error) {
        console.error('❌ Failed to fetch payments:', error);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        toast.error(`Failed to load payment history: ${error.response?.data?.message || error.message}`);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return CheckCircle;
      case 'failed':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'text-emerald-600 bg-emerald-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-amber-600 bg-amber-50';
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Loading payment history...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
        <CreditCard className="mx-auto mb-4 text-gray-400" size={40} />
        <h2 className="text-xl font-semibold text-gray-800">No Transactions Yet</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Your payment history and transaction details will appear here once you make a booking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Payment History</h2>
        <p className="text-gray-500 text-sm">View all your transaction records</p>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => {
          const StatusIcon = getStatusIcon(payment.status);
          const statusColor = getStatusColor(payment.status);
          const booking = payment.bookingId;

          return (
            <div
              key={payment._id}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Booking Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                      {booking?.serviceType || 'Unknown'}
                    </span>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{payment.status}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {booking?.displayTitle || booking?.title || 'Unknown Booking'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(payment.createdAt || payment.date)}</span>
                    </div>
                    {booking?.details?.airline && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {booking.details.airline}
                      </span>
                    )}
                    {booking?.details?.cabType && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {booking.details.cabType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Transaction */}
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Amount Paid
                  </p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center justify-end gap-1">
                    <IndianRupee className="h-5 w-5 text-gray-500" />
                    {payment.amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Txn ID: {payment.transactionId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Payments;
