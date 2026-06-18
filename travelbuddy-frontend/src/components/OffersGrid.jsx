import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const offers = [
  {
    title: "Goa Beach Escape",
    location: "Goa, India",
    description: "Relax on pristine beaches with sunrise yoga and seafood feasts.",
    price: "₹4,999",
    discount: "30% OFF",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    title: "Dubai Luxury Trip",
    location: "Dubai, UAE",
    description: "Experience opulence with desert safaris and iconic skyscrapers.",
    price: "₹45,999",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1498496294664-d9372eb521f9",
  },
  {
    title: "Paris Romantic Getaway",
    location: "Paris, France",
    description: "City of Light — Eiffel Tower, museums, and charming cafés.",
    price: "₹89,999",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    title: "Bali Retreat",
    location: "Bali, Indonesia",
    description: "Tropical paradise with luxurious accommodations, spa treatments, and ocean views.",
    price: "₹8,999",
    discount: "35% OFF",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    title: "Thailand Budget Tour",
    location: "Bangkok, Thailand",
    description: "Affordable adventure through temples, markets, and Thai cuisine.",
    price: "₹22,999",
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
  },
  {
    title: "Kashmir Paradise",
    location: "Srinagar, Kashmir",
    description: "Misty valleys, Dal Lake houseboats, and Mughal gardens.",
    price: "₹12,999",
    discount: "22% OFF",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a",
  },
  {
    title: "Singapore City Break",
    location: "Singapore",
    description: "Modern marvels, Gardens by the Bay, and world-class dining.",
    price: "₹35,999",
    discount: "18% OFF",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0",
  },
  {
    title: "Manali Adventure",
    location: "Manali, Himachal",
    description: "Snow-capped peaks, river rafting, and mountain adventures await.",
    price: "₹15,999",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16",
  },
  {
    title: "Maldives Luxury Escape",
    location: "Maldives",
    description: "Crystal-clear waters, luxurious overwater bungalows, and pristine beaches.",
    price: "₹59,999",
    discount: "40% OFF",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    title: "Switzerland Alps Tour",
    location: "Switzerland",
    description: "Majestic Alps, scenic trains, and charming villages.",
    price: "₹75,999",
    discount: "28% OFF",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  {
    title: "Andaman Island Escape",
    location: "Andaman & Nicobar",
    description: "Beaches, scuba diving, and crystal clear water.",
    price: "₹19,999",
    discount: "30% OFF",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
  },
  {
    title: "Ladakh Road Trip",
    location: "Leh-Ladakh",
    description: "High-altitude adventure, mountains, and bike trips.",
    price: "₹24,999",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
  },
];

const OffersGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Popular Destinations</h2>
        <p className="text-sm text-gray-500">Handpicked deals for your next vacation</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.title}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >

            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://source.unsplash.com/400x300/?travel";
                }}
                className="w-full h-full object-cover"
              />

            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                {offer.title}
              </h3>

              <p className="text-xs text-gray-500 mb-2 flex items-center">
                📍 {offer.location}
              </p>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {offer.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-indigo-600">
                  {offer.price}
                </span>
              </div>

              <button
                onClick={() => navigate('/packages')}
                className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Book Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* View All */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          View All Deals →
        </button>
      </div>

    </div>
  );
};

export default OffersGrid;