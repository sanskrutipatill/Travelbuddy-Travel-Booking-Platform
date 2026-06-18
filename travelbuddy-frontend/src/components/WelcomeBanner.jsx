import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Sparkles, ShieldCheck } from 'lucide-react';

const WelcomeBanner = ({ userName }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'My Trips',
      icon: Book,
      action: () => navigate('/dashboard/bookings'),
    },
    {
      title: 'Explore',
      icon: Sparkles,
      action: () => navigate('/'),
    },
    {
      title: 'Profile',
      icon: ShieldCheck,
      action: () => navigate('/dashboard/profile'),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Ready to explore new destinations? Your journey begins here. Find the best deals on flights, hotels, trains, and cabs.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decorative stats */}
        <div className="flex items-center gap-8 lg:pl-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">500+</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Destinations</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">98%</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Happy Travelers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
