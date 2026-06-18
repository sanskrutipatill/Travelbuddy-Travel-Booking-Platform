import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleBooking } from '../utils/handleBooking';

const OffersSection = () => {
  const navigate = useNavigate();

  const offers = [
    {
      id: 1,
      title: 'Goa Beach Escape',
      location: 'Goa, India',
      image: 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?goa,beach',
      description: 'Relax on pristine beaches with sunrise yoga and seafood feasts.',
      discount: 'Up to 30% OFF',
      type: 'hotels',
    },
    {
      id: 2,
      title: 'Dubai Luxury Trip',
      location: 'Dubai, UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?dubai,luxury',
      description: 'Experience opulence with desert safaris and iconic skyscrapers.',
      discount: 'Up to 25% OFF',
      type: 'packages',
    },
    {
      id: 3,
      title: 'Paris Romantic Getaway',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?paris,romantic',
      description: 'City of Light — Eiffel Tower, museums, and charming cafés.',
      discount: 'Up to 20% OFF',
      type: 'packages',
    },
    {
      id: 4,
      title: 'Bali Retreat',
      location: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?bali,resort',
      description: 'Tropical paradise with luxurious accommodations, spa treatments, and ocean views.',
      discount: 'Up to 35% OFF',
      type: 'hotels',
    },
    {
      id: 5,
      title: 'Thailand Budget Tour',
      location: 'Bangkok, Thailand',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?bangkok,thailand',
      description: 'Affordable adventure through temples, markets, and Thai cuisine.',
      discount: 'Up to 15% OFF',
      type: 'packages',
    },
    {
      id: 6,
      title: 'Kashmir Paradise',
      location: 'Srinagar, Kashmir',
      image: 'https://images.unsplash.com/photo-1587729927502-0656c9f75893?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?kashmir,mountains',
      description: 'Misty valleys, Dal Lake houseboats, and Mughal gardens.',
      discount: 'Up to 22% OFF',
      type: 'hotels',
    },
    {
      id: 7,
      title: 'Singapore City Break',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?singapore,modern',
      description: 'Modern marvels, Gardens by the Bay, and world-class dining.',
      discount: 'Up to 18% OFF',
      type: 'packages',
    },
    {
      id: 8,
      title: 'Manali Adventure',
      location: 'Manali, Himachal',
      image: 'https://images.unsplash.com/photo-1605590423641-845885581e61?auto=format&fit=crop&w=800&q=80',
      fallback: 'https://source.unsplash.com/800x600/?manali,snow,mountains',
      description: 'Snow-capped peaks, river rafting, and mountain adventures await.',
      discount: 'Up to 20% OFF',
      type: 'tours',
    },
  ];

  const handleBook = (offer) => {
    const typeMap = {
      hotels: 'hotel',
      packages: 'package',
      tours: 'tour',
      flights: 'flight',
      trains: 'train',
      cabs: 'cab',
    };
    const type = typeMap[offer.type] || offer.type;
    // Default price if not specified (since offers don't have price in the data)
    const numericPrice = 0; // or you could set a default like 5000
    const bookingItem = {
      ...offer,
      price: numericPrice,
      name: offer.title,
      location: offer.location,
    };
    handleBooking(navigate, type, bookingItem);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Destinations</h2>
        <p className="text-gray-500">Handpicked deals for your next vacation</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = offer.fallback || "https://source.unsplash.com/800x600/?travel,destination";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Subtle overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-t-xl pointer-events-none" />
              {/* Discount Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm">
                  {offer.discount}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">
                {offer.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {offer.location}
              </p>
              <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {offer.description}
              </p>

              <button
                onClick={() => handleBook(offer)}
                className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg text-sm font-medium transition-all"
              >
                <span>Book Now</span>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="mt-8 text-center">
        <button className="inline-flex items-center space-x-2 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
          <span>View All Deals</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OffersSection;
