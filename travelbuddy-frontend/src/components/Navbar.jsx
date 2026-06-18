import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plane, Hotel, Train, CarTaxiFront, LogOut, User as UserIcon, Menu, X, Shield, Settings } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Flights', icon: Plane, path: '/results/flights' },
    { name: 'Hotels', icon: Hotel, path: '/results/hotels' },
    { name: 'Trains', icon: Train, path: '/results/trains' },
    { name: 'Cabs', icon: CarTaxiFront, path: '/results/cabs' },
  ];

  const adminLinks = isAdmin ? [
    { name: 'Admin Panel', icon: Shield, path: '/admin/dashboard' },
  ] : [];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-600">
              TravelBuddy
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-blue-600 flex items-center space-x-1 font-medium transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            ))}
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-yellow-600 hover:text-yellow-700 flex items-center space-x-1 font-medium transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth/Profile section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-100/80 hover:bg-gray-200 transition-colors rounded-full pr-4 pl-1 py-1 cursor-pointer">
                  <img src={user.avatar && user.avatar.trim() !== '' ? user.avatar : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&rounded=true&size=32`} alt="avatar" className="w-8 h-8 rounded-full shadow-sm" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 py-4 px-4 flex flex-col space-y-4 rounded-b-xl border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-3 font-medium px-2 py-2 rounded-md hover:bg-gray-50"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}
          {adminLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-yellow-600 hover:text-yellow-700 flex items-center space-x-3 font-medium px-2 py-2 rounded-md hover:bg-yellow-50"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}

          <div className="border-t border-gray-100 pt-4 mt-2">
            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 px-2 py-2">
                  <img src={user.avatar && user.avatar.trim() !== '' ? user.avatar : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&rounded=true&size=32`} alt="avatar" className="w-8 h-8 rounded-full shadow-sm" />
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-red-600 font-medium px-2 py-2 hover:bg-red-50 rounded-md w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-200 transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
