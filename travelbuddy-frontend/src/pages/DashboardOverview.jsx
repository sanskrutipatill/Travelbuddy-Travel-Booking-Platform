import React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeBanner from '../components/WelcomeBanner';
import StatsGrid from '../components/StatsGrid';
import BookingTable from '../components/BookingTable';
import { ArrowRight, Plane, Hotel, Train, CarTaxiFront, FileText, CalendarDays, CreditCard } from 'lucide-react';

const DashboardOverview = ({ bookings, user, loading, onCancel }) => {
  const navigate = useNavigate();

  const totalSpent = bookings.reduce(
    (acc, curr) => (curr.status !== 'cancelled' ? acc + curr.price : acc),
    0
  );

  const upcomingTrips = bookings.filter(
    (b) => new Date(b.date) > new Date() && b.status === 'confirmed'
  );

  const nextUpcomingTrip = upcomingTrips[0];

  const popularDestinations = [
    { name: 'Kuala Lumpur', price: '$320', icon: Plane },
    { name: 'Bali', price: '$450', icon: Plane },
    { name: 'Tokyo', price: '$620', icon: Plane },
    { name: 'Paris', price: '$580', icon: Plane },
  ];

  return (
    <div className="space-y-8">
      <WelcomeBanner userName={user?.name?.split(' ')[0] || user?.name} />

      {/* Stats Grid */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Travel Insights</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of your travel activity</p>
        </div>
        <StatsGrid bookings={bookings} totalSpent={totalSpent} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Upcoming Trip */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Next Upcoming Trip</h2>
              <p className="text-sm text-gray-500 mt-1">Your upcoming adventure</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/upcoming')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {nextUpcomingTrip ? (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  {(() => {
                    const Icon = nextUpcomingTrip.serviceType === 'flight' ? Plane
                      : nextUpcomingTrip.serviceType === 'hotel' ? Hotel
                      : nextUpcomingTrip.serviceType === 'train' ? Train
                      : CarTaxiFront;
                    return <Icon className="h-8 w-8 text-indigo-600" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {nextUpcomingTrip.serviceType === 'hotel'
                      ? nextUpcomingTrip.details?.name
                      : nextUpcomingTrip.serviceType === 'train'
                      ? `${nextUpcomingTrip.details?.name || nextUpcomingTrip.details?.trainName} (${nextUpcomingTrip.details?.trainNumber || 'No Number'})`
                      : nextUpcomingTrip.serviceType === 'cab'
                      ? `${nextUpcomingTrip.details?.pickup} → ${nextUpcomingTrip.details?.drop}`
                      : `${nextUpcomingTrip.details?.source} → ${nextUpcomingTrip.details?.destination}`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {new Date(nextUpcomingTrip.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {nextUpcomingTrip.details?.airline && ` • ${nextUpcomingTrip.details.airline}`}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium capitalize">
                      {nextUpcomingTrip.serviceType}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {nextUpcomingTrip.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-2xl font-bold text-gray-900">₹{nextUpcomingTrip.price?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No upcoming trips booked yet.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Explore Destinations
              </button>
            </div>
          )}
        </section>

        {/* Quick Stats Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl text-left transition-colors group"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="font-semibold text-gray-800">My Bookings</p>
              <p className="text-xs text-gray-500">{bookings.length} total</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/upcoming')}
              className="p-4 bg-gray-50 hover:bg-green-50 rounded-xl text-left transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200">
                <CalendarDays className="h-5 w-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-800">Upcoming</p>
              <p className="text-xs text-gray-500">{upcomingTrips.length} trips</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/payments')}
              className="p-4 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-800">Payments</p>
              <p className="text-xs text-gray-500">View history</p>
            </button>
          </div>
        </section>
      </div>

      {/* Recent Bookings */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <p className="text-sm text-gray-500 mt-1">Your latest reservations</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/bookings')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        <BookingTable
          bookings={bookings.slice(0, 3)}
          loading={loading}
          onCancel={onCancel}
          showActions
        />
      </section>

      {/* Explore Popular Destinations */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Explore Popular Destinations</h2>
          <p className="text-sm text-gray-500 mt-1"> inspiration for your next trip</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularDestinations.map((dest, index) => {
            const Icon = dest.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{dest.name}</h3>
                <p className="text-sm text-gray-500">From {dest.price}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Explore More
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
