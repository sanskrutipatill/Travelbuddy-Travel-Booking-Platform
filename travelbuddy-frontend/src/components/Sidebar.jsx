import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plane,
  Building,
  Gift,
  Train,
  Car,
  Ticket,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { id: 'flights', label: 'Flights', icon: Plane, path: '/flights' },
  { id: 'hotels', label: 'Hotels', icon: Building, path: '/hotels' },
  { id: 'packages', label: 'Holiday Packages', icon: Gift, path: '/packages' },
  { id: 'trains', label: 'Trains', icon: Train, path: '/trains' },
  { id: 'cabs', label: 'Cabs', icon: Car, path: '/cabs' },
  { id: 'tours', label: 'Tours', icon: Ticket, path: '/tours' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-64 shadow-xl border-r border-gray-100">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              TravelBuddy
            </h1>
            <p className="text-xs text-gray-500">Premium Travel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 hover:text-purple-600'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'group-hover:text-purple-500'}`} />
                <span className={`font-medium text-sm ${active ? 'text-white' : ''}`}>
                  {item.label}
                </span>
                {active && <ChevronRight className="h-4 w-4 ml-auto text-white" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all">
          <User className="h-5 w-5" />
          <span className="font-medium text-sm">My Account</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all mt-2">
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
