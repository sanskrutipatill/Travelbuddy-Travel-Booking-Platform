import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, Star, CheckCircle, Wifi, Car, Utensils, Shield, Clock, Users } from 'lucide-react';

const PackageDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pkg = location.state?.pkg;
  const travellers = parseInt(searchParams.get("passengers")) || 1;

  const [travellersCount, setTravellersCount] = useState(travellers);

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

  const pricePerPerson = pkg.price || 0;
  const totalAmount = pricePerPerson * travellersCount;

  // Inclusions mapping to icons
  const inclusionIcons = {
    'Hotel': Wifi,
    'Transfers': Car,
    'Meals': Utensils,
    'Sightseeing': CheckCircle,
    'Insurance': Shield,
    'Flights': Wifi,
    'Guide': Users,
  };

  const handleBookNow = () => {
    navigate('/package-checkout', {
      state: {
        pkg,
        totalAmount,
        travellers: travellersCount
      }
    });
  };

  const incrementTravellers = () => setTravellersCount(prev => prev + 1);
  const decrementTravellers = () => setTravellersCount(prev => (prev > 1 ? prev - 1 : 1));

  // Default inclusions if not specified
  const inclusions = pkg.highlights || ['Hotel Stay', 'Transfers', 'Meals', 'Sightseeing'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{pkg.title || 'Package Name'}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{pkg.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{pkg.rating || 'N/A'}</span>
                  <span className="text-gray-400">({pkg.reviews || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="text-lg font-bold text-gray-900">{pkg.type || 'Package'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inclusions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {inclusions.map((inclusion, idx) => {
                  const IconComponent = inclusionIcons[inclusion] || CheckCircle;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{inclusion}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Duration & Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tour Overview</h2>
              <div className="flex items-center gap-3 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-bold text-gray-900">{pkg.duration || 'Not specified'}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-3">About This Package</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                Experience an unforgettable journey to <strong>{pkg.location}</strong> with this carefully curated {pkg.type?.toLowerCase()} package.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Top highlights include {inclusions.slice(0, 3).join(', ')} and many more exciting activities.
              </p>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
              <p className="text-gray-600 mb-2">Free cancellation up to 7 days before departure. After that, standard cancellation charges apply (25%-100% based on timing).</p>
            </div>
          </div>

          {/* Right: Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Package</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price per person</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-900 font-semibold">₹{pricePerPerson.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travellers</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementTravellers}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">{travellersCount}</span>
                    <button
                      onClick={incrementTravellers}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400">Including all taxes & fees</p>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Book Now
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
