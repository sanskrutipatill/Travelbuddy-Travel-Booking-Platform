import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Plane,
  Hotel,
  Train,
  CarTaxiFront,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  CalendarDays,
  Package,
  Map,
} from 'lucide-react';

const ModernNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Flights', icon: Plane, path: '/results/flights' },
    { name: 'Hotels', icon: Hotel, path: '/results/hotels' },
    { name: 'Packages', icon: Package, path: '/results/packages' },
    { name: 'Trains', icon: Train, path: '/results/trains' },
    { name: 'Cabs', icon: CarTaxiFront, path: '/results/cabs' },
    { name: 'Tours', icon: Map, path: '/tours' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <nav className="sticky top-0 z-50">
      {/* Glassmorphism Container */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border-b border-white/10 shadow-sm rounded-b-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo - Pill style with light background */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full shadow-sm border border-white/20 group-hover:bg-white/30 group-hover:shadow transition-all duration-300">
              <Plane className="h-5 w-5 text-gray-800" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              TravelBuddy
            </span>
          </Link>

          {/* Desktop Navigation - Centered, clean links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="group relative px-4 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:text-blue-600 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </span>
                {/* Animated underline on hover */}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Right Side - Profile / Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                

                {/* User Profile Pill */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/40 hover:shadow transition-all duration-300"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=40&rounded=true`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                      <div className="px-5 py-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-3">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300"
                        >
                          <UserIcon className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/dashboard/bookings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300"
                        >
                          <CalendarDays className="h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </div>
                      <div className="p-3 border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-white/20 hover:text-blue-600 font-medium transition-all duration-300"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="border-t border-white/20 pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=40&rounded=true`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full shadow-sm ring-1 ring-white/50"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-white/20 hover:text-blue-600 font-medium transition-all duration-300"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-white/20 hover:text-blue-600 font-medium transition-all duration-300"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-white/20 hover:text-blue-600 font-medium transition-all duration-300"
                  >
                    <CalendarDays className="h-5 w-5" />
                    <span>My Bookings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-800 hover:bg-white/40 font-medium text-center transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-center shadow-md transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;
