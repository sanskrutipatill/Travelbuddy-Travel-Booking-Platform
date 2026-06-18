import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, Star, Wifi, Car, Coffee, Droplets, Dumbbell, Tv, Utensils, ShowerHead } from 'lucide-react';

const amenityIcons = {
  'WiFi': Wifi,
  'Parking': Car,
  'Pool': Droplets,
  'Restaurant': Utensils,
  'Gym': Dumbbell,
  'AC': ShowerHead, // using ShowerHead as placeholder
  'TV': Tv,
  'Spa': Coffee, // using Coffee as placeholder
};

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hotel = location.state?.hotel;
  const guests = parseInt(searchParams.get("guests")) || 1;

  const [guestsCount, setGuestsCount] = useState(guests);

  useEffect(() => {
    if (!hotel) {
      toast.error('Hotel information not found');
      navigate('/hotels');
    }
  }, [hotel, navigate]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const pricePerNight = hotel.price || 0;
  const totalAmount = pricePerNight * guestsCount;

  // Default amenities if not specified (from HotelsPage pattern)
  const amenities = hotel.amenities || ['Free WiFi', 'Parking', 'Restaurant'];

  const handleBookNow = () => {
    navigate('/hotel-checkout', {
      state: {
        hotel,
        totalAmount,
        guests: guestsCount
      }
    });
  };

  const incrementGuests = () => setGuestsCount(prev => prev + 1);
  const decrementGuests = () => setGuestsCount(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name || 'Hotel Name'}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{hotel.location || hotel.city || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{hotel.rating || 'N/A'}</span>
                  <span className="text-gray-400">({hotel.reviews || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Property Type</p>
              <p className="text-lg font-bold text-gray-900">{hotel.type || 'Hotel'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenities.map((amenity, idx) => {
                  const IconComponent = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rooms Availability */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Room Availability</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div>
                    <p className="font-semibold text-gray-900">Standard Room</p>
                    <p className="text-sm text-gray-500">King Bed, En-suite Bathroom</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Available</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div>
                    <p className="font-semibold text-gray-900">Deluxe Room</p>
                    <p className="text-sm text-gray-500">City View, Mini Bar</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Available</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div>
                    <p className="font-semibold text-gray-900">Suite</p>
                    <p className="text-sm text-gray-500">Living Room, Balcony</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Available</span>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
              <p className="text-gray-600 mb-2">Free cancellation up to 24 hours before check-in. After that, standard cancellation charges apply as per hotel policy.</p>
            </div>
          </div>

          {/* Right: Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stay</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price per night</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-900 font-semibold">₹{pricePerNight.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementGuests}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">{guestsCount}</span>
                    <button
                      onClick={incrementGuests}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600">Total amount</span>
                    <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400">Including all taxes</p>
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

export default HotelDetails;
