import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  User,
  CalendarDays,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CollapsibleSidebar = () => {
  const { user } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Bookings', icon: FileText, path: '/dashboard/bookings' },
    { name: 'Upcoming Trips', icon: CalendarDays, path: '/dashboard/upcoming' },
    { name: 'Payments', icon: CreditCard, path: '/dashboard/payments' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },

  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden xl:flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 z-40`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                TravelBuddy
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {user?.role === 'Admin' ? 'Admin Panel' : 'My Account'}
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-all ${
              isCollapsed ? 'mx-auto' : ''
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.name === 'Overview'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <NavLink
            to="/help"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <HelpCircle className="h-5 w-5" />
            {!isCollapsed && <span>Help & Support</span>}
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          {menuItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.name === 'Overview'}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-xl transition-all ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default CollapsibleSidebar;
