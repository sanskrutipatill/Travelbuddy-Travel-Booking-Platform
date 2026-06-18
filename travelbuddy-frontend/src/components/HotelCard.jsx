import React, { useState } from 'react';
import { Star, Heart, MapPin, IndianRupee, ArrowRight } from 'lucide-react';

// Static fallback images
const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
];

const ULTIMATE_FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

const HotelCard = ({ hotel, onBook, onViewDetails, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Deterministic image selection
  const image = hotel.image && hotel.image !== ""
    ? hotel.image
    : HOTEL_IMAGES[index % HOTEL_IMAGES.length];

  const hasDiscount = hotel.originalPrice && hotel.originalPrice > hotel.price;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      style: 'decimal',
    }).format(price);
  };

  return (
    // CARD CONTAINER: Match Packages style
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* SECTION 1: IMAGE */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={imgError ? ULTIMATE_FALLBACK : image}
          alt={hotel.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
          {hotel.propertyType || hotel.type || 'Hotel'}
        </div>
        {/* Rating badge - only show if high rating */}
        {hotel.rating >= 4.5 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-gray-900 flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{hotel.rating}</span>
          </div>
        )}
      </div>

      {/* SECTION 2: CONTENT */}
      <div className="p-4">
        {/* Hotel Name */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
            {hotel.name}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
          <MapPin className="h-3 w-3" />
          <span>{hotel.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 text-xs text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{hotel.rating}</span>
          </div>
        </div>

        {/* Amenities - show only 2 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities?.slice(0, 2).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Footer - Price & Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
                ₹{formatPrice(hotel.originalPrice)}
              </p>
            )}
            <div className="flex items-center space-x-1">
              <IndianRupee className="h-3 w-3 text-gray-400" />
              <span className="text-lg font-bold text-gray-900">
                ₹{formatPrice(hasDiscount ? hotel.originalPrice : hotel.price)}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">/night</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook(hotel);
            }}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center space-x-1"
          >
            <span>Book</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
