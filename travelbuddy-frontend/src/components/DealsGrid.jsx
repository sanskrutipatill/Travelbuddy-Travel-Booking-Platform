import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleBooking } from '../utils/handleBooking';

const deals = [
  {
    id: 1,
    title: 'Goa Beach Escape',
    location: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Relax on pristine beaches with sunrise yoga and seafood feasts.',
    discount: 'Up to 30% OFF',
    type: 'hotels',
    price: '₹4,999',
  },
  {
    id: 2,
    title: 'Dubai Luxury Trip',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Experience opulence with desert safaris and iconic skyscrapers.',
    discount: 'Up to 25% OFF',
    type: 'packages',
    price: '₹45,999',
  },
  {
    id: 3,
    title: 'Paris Romantic Getaway',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'City of Light — Eiffel Tower, museums, and charming cafés.',
    discount: 'Up to 20% OFF',
    type: 'packages',
    price: '₹89,999',
  },
  {
    id: 4,
    title: 'Bali Retreat',
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Tropical paradise with luxurious accommodations, spa treatments, and ocean views.',
    discount: 'Up to 35% OFF',
    type: 'hotels',
    price: '₹8,999',
  },
  {
    id: 5,
    title: 'Thailand Budget Tour',
    location: 'Bangkok, Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Affordable adventure through temples, markets, and Thai cuisine.',
    discount: 'Up to 15% OFF',
    type: 'packages',
    price: '₹22,999',
  },
  {
    id: 6,
    title: 'Kashmir Paradise',
    location: 'Srinagar, Kashmir',
    image: 'https://images.unsplash.com/photo-1587729927502-0656c9f75893?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Misty valleys, Dal Lake houseboats, and Mughal gardens.',
    discount: 'Up to 22% OFF',
    type: 'hotels',
    price: '₹12,999',
  },
  {
    id: 7,
    title: 'Singapore City Break',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Modern marvels, Gardens by the Bay, and world-class dining.',
    discount: 'Up to 18% OFF',
    type: 'packages',
    price: '₹35,999',
  },
  {
    id: 8,
    title: 'Manali Adventure',
    location: 'Manali, Himachal',
    image: 'https://images.unsplash.com/photo-1605590423641-845885581e61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Snow-capped peaks, river rafting, and mountain adventures await.',
    discount: 'Up to 20% OFF',
    type: 'tours',
    price: '₹15,999',
  },
  {
    id: 9,
    title: 'Maldives Luxury Escape',
    location: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Crystal-clear waters, luxurious overwater bungalows, and pristine beaches.',
    discount: 'Up to 40% OFF',
    type: 'hotels',
    price: '₹35,999',
  },
  {
    id: 10,
    title: 'Switzerland Alps Tour',
    location: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Majestic Alps, scenic trains, and charming villages.',
    discount: 'Up to 28% OFF',
    type: 'packages',
    price: '₹1,29,999',
  },
];

const DealsGrid = () => {
  const navigate = useNavigate();

  const handleBook = (deal) => {
    const typeMap = {
      hotels: 'hotel',
      packages: 'package',
      tours: 'tour',
      flights: 'flight',
      trains: 'train',
      cabs: 'cab',
    };
    const type = typeMap[deal.type] || deal.type;
    const numericPrice = parseInt(deal.price.replace(/[^\d]/g, ''), 10) || 0;
    const bookingItem = {
      ...deal,
      price: numericPrice,
      name: deal.title,
      location: deal.location,
    };
    handleBooking(navigate, type, bookingItem);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Hot Deals & Offers</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Discover our handpicked travel deals and start planning your next adventure
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={deal.image}
                alt={deal.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                  {deal.discount}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {deal.title}
              </h3>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {deal.location}
              </div>

              <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                {deal.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Starting from</p>
                  <p className="text-2xl font-bold text-blue-600">{deal.price}</p>
                </div>
                <button
                  onClick={() => handleBook(deal)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
                >
                  <span>Book Now</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsGrid;
