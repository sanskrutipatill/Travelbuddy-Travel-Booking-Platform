import React from 'react';
import { useNavigate } from 'react-router-dom';

const deals = [
  {
    id: 1,
    title: 'Goa Beach Escape',
    location: 'Goa, India',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Relax on pristine beaches with sunrise yoga and seafood feasts.',
    discount: '30% OFF',
    type: 'hotels',
    price: '₹4,999',
  },
  {
    id: 2,
    title: 'Dubai Luxury Trip',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Experience opulence with desert safaris and iconic skyscrapers.',
    discount: '25% OFF',
    type: 'packages',
    price: '₹45,999',
  },
  {
    id: 3,
    title: 'Paris Romantic Getaway',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'City of Light — Eiffel Tower, museums, and charming cafés.',
    discount: '20% OFF',
    type: 'packages',
    price: '₹89,999',
  },
  {
    id: 4,
    title: 'Bali Retreat',
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Tropical paradise with luxurious accommodations, spa treatments, and ocean views.',
    discount: '35% OFF',
    type: 'hotels',
    price: '₹8,999',
  },
  {
    id: 5,
    title: 'Thailand Budget Tour',
    location: 'Bangkok, Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Affordable adventure through temples, markets, and Thai cuisine.',
    discount: '15% OFF',
    type: 'packages',
    price: '₹22,999',
  },
  {
    id: 6,
    title: 'Kashmir Paradise',
    location: 'Srinagar, Kashmir',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Misty valleys, Dal Lake houseboats, and Mughal gardens.',
    discount: '22% OFF',
    type: 'hotels',
    price: '₹12,999',
  },
  {
    id: 7,
    title: 'Singapore City Break',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Modern marvels, Gardens by the Bay, and world-class dining.',
    discount: '18% OFF',
    type: 'packages',
    price: '₹35,999',
  },
  {
    id: 8,
    title: 'Manali Adventure',
    location: 'Manali, Himachal',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Snow-capped peaks, river rafting, and mountain adventures await.',
    discount: '20% OFF',
    type: 'tours',
    price: '₹15,999',
  },
];

const DealsCarousel = () => {
  const navigate = useNavigate();

  const handleCardClick = (deal) => {
    // Convert price from string "₹4,999" to number 4999 if needed
    const numericPrice = typeof deal.price === 'string'
      ? parseInt(deal.price.replace(/[^\d]/g, ''), 10)
      : deal.price || 5000;

    // Ensure type is singular
    const typeMap = {
      hotels: 'hotel',
      packages: 'package',
      tours: 'tour',
      flights: 'flight',
      trains: 'train',
      cabs: 'cab',
    };
    const type = typeMap[deal.type] || deal.type || 'package';

    // Enrich the item for ExploreDetails
    const enrichedItem = {
      ...deal,
      price: numericPrice,
      name: deal.title,
      location: deal.location,
      type: type,
      description: deal.description || `Amazing deal: ${deal.title}`,
      duration: deal.duration || '3-5 days',
    };

    navigate('/explore-details', { state: { item: enrichedItem } });
  };

  return (
    <div className="max-w-7xl mx-auto px-16 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Hot Deals & Offers</h2>
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          Discover our handpicked travel deals and exclusive discounts
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => handleCardClick(deal)}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 group cursor-pointer"
          >

            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-medium">
                {deal.discount}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                {deal.title}
              </h3>

              <p className="text-sm text-gray-500 mb-1">📍 {deal.location}</p>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {deal.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-blue-600">
                  {deal.price}
                </span>

                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default DealsCarousel;
