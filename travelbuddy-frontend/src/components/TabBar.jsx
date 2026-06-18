import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plane, Building, Gift, Train, Car, Ticket } from 'lucide-react';

const tabs = [
  { id: 'flights', label: 'Flights', icon: Plane, path: '/flights' },
  { id: 'hotels', label: 'Hotels', icon: Building, path: '/hotels' },
  { id: 'packages', label: 'Holiday Packages', icon: Gift, path: '/packages' },
  { id: 'trains', label: 'Trains', icon: Train, path: '/trains' },
  { id: 'cabs', label: 'Cabs', icon: Car, path: '/cabs' },
  { id: 'tours', label: 'Tours', icon: Ticket, path: '/tours' },
];

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/flights') return currentPath === '/flights';
    if (path === '/hotels') return currentPath === '/hotels';
    if (path === '/packages') return currentPath === '/packages';
    if (path === '/trains') return currentPath === '/trains';
    if (path === '/cabs') return currentPath === '/cabs';
    if (path === '/tours') return currentPath === '/tours';
    return false;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide space-x-1 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
