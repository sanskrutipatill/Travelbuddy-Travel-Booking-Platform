import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, IndianRupee, Bed, Wifi, Car, Coffee, ArrowRight } from 'lucide-react';
import { handleBooking } from '../utils/handleBooking';

const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('date') || '';

  const hotels = [
    {
      id: 1,
      name: 'Taj Lands End',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 12500,
      rating: 4.8,
      reviews: 3240,
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Pool'],
      type: '5 Star',
    },
    {
      id: 2,
      name: 'The Oberoi',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 18500,
      rating: 4.9,
      reviews: 2180,
      amenities: ['Free WiFi', 'Spa', 'Pool', 'Fine Dining'],
      type: '5 Star Deluxe',
    },
    {
      id: 3,
      name: 'ITC Maratha',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 9800,
      rating: 4.6,
      reviews: 1890,
      amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Bar'],
      type: '5 Star',
    },
    {
      id: 4,
      name: 'Trident Hotel',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 7200,
      rating: 4.4,
      reviews: 1520,
      amenities: ['Free WiFi', 'Parking', 'Restaurant'],
      type: '4 Star',
    },
    {
      id: 5,
      name: 'F international',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 5600,
      rating: 4.2,
      reviews: 980,
      amenities: ['Free WiFi', 'Restaurant', 'Room Service'],
      type: '3 Star',
    },
    {
      id: 6,
      name: 'The St. Regis',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 22000,
      rating: 4.9,
      reviews: 2560,
      amenities: ['Free WiFi', 'Spa', 'Pool', 'Butler Service'],
      type: '5 Star Luxury',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{location || 'All Locations'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bed className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">1 Room, 2 Guests</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Modify Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Hotels in {location || 'Mumbai'}</h1>
            <p className="text-xs text-gray-500 mt-1">{hotels.length} properties found</p>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Popularity</option>
            </select>
          </div>
        </div>

        {/* Hotel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                  {hotel.type}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{hotel.name}</h3>
                </div>

                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{hotel.location}</span>
                </div>

                <div className="flex items-center space-x-1 text-xs text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{hotel.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 line-through">₹{hotel.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="h-3 w-3 text-gray-400" />
                      <span className="text-lg font-bold text-gray-900">{hotel.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">/night</p>
                  </div>
                  <button
                    onClick={(e) => {
                      const normalizedHotel = {
                        ...hotel,
                        name: hotel.name || hotel.title || 'Hotel',
                        location: hotel.location || hotel.city || 'Unknown Location',
                        price: hotel.price || 0,
                      };
                      handleBooking(navigate, 'hotel', normalizedHotel);
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center space-x-1"
                  >
                    <span>Book</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
