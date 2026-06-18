import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchHero from '../components/SearchHero';
import DealsCarousel from '../components/DealsCarousel';

const ScrollSection = ({ title, data, onCardClick }) => {
  return (
    <div className="mt-20 px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => onCardClick(item)}
              className="min-w-[280px] h-[200px] relative rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 hover:shadow-md transition-shadow duration-300 group cursor-pointer"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs px-2.5 py-1 rounded-md font-medium">
                {item.tag}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-base font-medium leading-tight">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const handleExploreClick = (item) => {
    const enrichedItem = {
      ...item,
      name: item.title || item.name,
      location: item.location || item.destination || item.title || 'India',
      price: item.price || 5000,
      type: item.type || 'destination',
      description: item.description || `Experience the best of ${item.title || item.name || 'this destination'}.`,
      duration: item.duration || '3-5 days',
    };
    navigate('/explore-details', { state: { item: enrichedItem } });
  };

  const collections = [
    {
      title: "Stays in & Around Delhi",
      tag: "TOP 8",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      type: 'hotel',
      price: 4999,
      description: "Discover the finest accommodations and experiences in and around the capital city. From luxury hotels to cozy stays, explore curated options for every traveler.",
      duration: '2-4 days',
      location: 'Delhi, India',
    },
    {
      title: "Mumbai Weekend Getaway",
      tag: "TOP 8",
      image: "https://images.unsplash.com/photo-1562979314-bee7453e911c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'hotel',
      price: 5999,
      description: "Escape to the city of dreams for a perfect weekend. Enjoy the vibrant nightlife, stunning seafront, and world-class hospitality.",
      duration: '2-3 days',
      location: 'Mumbai, India',
    },
    {
      title: "Bangalore Weekend",
      tag: "TOP 9",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'hotel',
      price: 5499,
      description: "Explore the Silicon Valley of India. Perfect blend of technology, gardens, and vibrant culture awaits you.",
      duration: '2-3 days',
      location: 'Bangalore, India',
    },
    {
      title: "Beach Destinations",
      tag: "TOP 11",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'package',
      price: 7999,
      description: "Sink your toes into pristine sands and crystal-clear waters. Our beach destinations offer the perfect tropical escape.",
      duration: '4-6 days',
      location: 'Goa, India',
    },
    {
      title: "Hill Stations",
      tag: "TOP 11",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'package',
      price: 6999,
      description: "Cool mountains, lush greenery, and breathtaking views. Perfect retreat from the summer heat.",
      duration: '3-5 days',
      location: 'Himachal Pradesh, India',
    },
    {
      title: "Adventure Destinations",
      tag: "TOP 11",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'tour',
      price: 8999,
      description: "For thrill-seekers! Trekking, river rafting, paragliding, and more. Adventure awaits at every corner.",
      duration: '4-7 days',
      location: 'Various Locations',
    },
    {
      title: "Heritage Destinations",
      tag: "TOP 11",
      image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
      type: 'tour',
      price: 6500,
      description: "Step back in time and explore India's rich cultural heritage. Ancient temples, palaces, and UNESCO sites.",
      duration: '5-8 days',
      location: 'Rajasthan, India',
    },
    {
      title: "Pilgrimage Destinations",
      tag: "TOP 11",
      image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'tour',
      price: 5500,
      description: "Embark on a spiritual journey to sacred sites. Experience peace, devotion, and timeless traditions.",
      duration: '4-7 days',
      location: 'Various Locations',
    },
    { title: "Luxury Escapes", tag: "TOP 10", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'package', price: 19999, description: "Indulge in premium experiences, 5-star accommodations, and exclusive services. Royal treatment awaits.", duration: '3-5 days', location: 'Various Luxury Destinations' },
    { title: "Romantic Getaways", tag: "TOP 10", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", type: 'package', price: 12999, description: "Reignite the romance with your partner. From cozy hill stations to exotic beaches, create memories together.", duration: '2-4 days', location: 'Various Romantic Spots' },
    { title: "Family Vacations", tag: "TOP 10", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'package', price: 9999, description: "Fun for the whole family! Theme parks, kid-friendly activities, and comfortable stays for all ages.", duration: '5-7 days', location: 'Various Family Destinations' },
    { title: "City Breaks", tag: "TOP 10", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 7999, description: "Short urban escapes to vibrant cities. Explore culture, cuisine, shopping, and nightlife.", duration: '2-3 days', location: 'Major Cities' },
  ];

  const wonders = [
    {
      title: "Himalayan Escape",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'tour',
      price: 10999,
      description: "Journey through the majestic Himalayas. Snow-capped peaks, serene monasteries, and thrilling treks await.",
      duration: '5-7 days',
      location: 'Himalayan Region',
    },
    {
      title: "Hidden Hill Station",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'destination',
      price: 6999,
      description: "Discover a pristine hill station away from the crowds. Misty mornings, clean air, and peaceful vibes.",
      duration: '3-4 days',
      location: 'Offbeat Hill Station',
    },
    {
      title: "Snowy Retreat",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'package',
      price: 12999,
      description: "Experience winter wonderland magic. Snow activities, cozy bonfires, and breathtaking snowy landscapes.",
      duration: '4-5 days',
      location: 'Snowy Region, India',
    },
    {
      title: "Coastal Village",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1200&q=80",
      type: 'destination',
      price: 5999,
      description: "Relax in a quaint coastal village. Fishing communities, virgin beaches, and fresh seafood.",
      duration: '2-3 days',
      location: 'Coastal Region',
    },
    {
      title: "Forest Trails",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'tour',
      price: 8499,
      description: "Walk through pristine forests and Wildlife Sanctuaries. Spot wildlife, enjoy bird watching, and connect with nature.",
      duration: '3-4 days',
      location: 'Forest Region',
    },
    {
      title: "Desert Adventure",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'tour',
      price: 9999,
      description: "Experience the thrill of the desert. Camel safaris, dune bashing, and starlit desert camps.",
      duration: '2-4 days',
      location: 'Rajasthan Desert',
    },
    {
      title: "Island Escape",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'package',
      price: 14999,
      description: "Getaway to a tropical island paradise. Turquoise waters, coral reefs, and pristine beaches.",
      duration: '4-6 days',
      location: 'Island Destination',
    },
    {
      title: "Cultural Villages",
      tag: "Explore",
      image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      type: 'tour',
      price: 7999,
      description: "Immerse yourself in local culture. Live like a villager, learn traditional crafts, and savor authentic cuisine.",
      duration: '3-5 days',
      location: 'Rural India',
    },
    { title: "Backwater Retreat", tag: "Explore", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'package', price: 11999, description: "Glide through serene backwaters on a traditional houseboat. Lush green landscapes and tranquil waters.", duration: '2-3 days', location: 'Kerala Backwaters' },
    { title: "Tea Garden Escape", tag: "Explore", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 8999, description: "Visit lush tea plantations and aromatic tea gardens. Learn about tea processing and enjoy scenic views.", duration: '3-4 days', location: 'Darjeeling/Assam' },
    { title: "Mountain Sunrise", tag: "Explore", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'tour', price: 9999, description: "Wake up to stunning mountain sunrises. Early morning treks to viewpoints and unforgettable vistas.", duration: '2-3 days', location: 'Mountain Region' },
    { title: "Hidden Waterfalls", tag: "Explore", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 6499, description: "Trek to secluded waterfalls hidden in the wilderness. Refreshing natural pools and picnic spots.", duration: '2-3 days', location: 'Forest/Mountain Area' },
  ];

  const stats = [
    { value: "10,000+", label: "Flights" },
    { value: "50,000+", label: "Hotels" },
    { value: "5,000+", label: "Destinations" },
    { value: "98%", label: "Happy Customers" },
  ];

  // Prepare destinations with enriched data
  const destinations = [
    { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 15999, description: "Explore the iconic City of Light. Visit the Eiffel Tower, Louvre Museum, and charming cafés. A perfect romantic getaway.", duration: '5-7 days', location: 'Paris, France' },
    { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'package', price: 12999, description: "Tropical paradise with lush rice terraces, ancient temples, and world-class spas. An unforgettable island experience.", duration: '6-8 days', location: 'Bali, Indonesia' },
    { name: "Dubai, UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'package', price: 18999, description: "Modern marvels, desert safaris, and luxury shopping. Experience the glitz and glamour of this incredible city.", duration: '4-6 days', location: 'Dubai, UAE' },
    { name: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 24999, description: "Crystal-clear waters, overwater bungalows, and pristine beaches. The ultimate tropical paradise for honeymooners.", duration: '5-7 days', location: 'Maldives' },
    { name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 17999, description: "White-washed buildings, blue domes, and stunning sunsets. A romantic Greek island like no other.", duration: '4-6 days', location: 'Santorini, Greece' },
    { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", type: 'destination', price: 14999, description: "Where ancient tradition meets cutting-edge technology. Explore temples, gardens, and world-class cuisine.", duration: '6-8 days', location: 'Tokyo, Japan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div className="relative h-[50vh]">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          className="absolute w-full h-full object-cover"
          alt="Hero background"
        />
        {/* Smooth fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-white"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight max-w-4xl">
            Find and Book Your Perfect Trip
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/90 max-w-xl">
            Flights, hotels, and packages at the best prices
          </p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto -mt-16 relative z-20">
        <SearchHero />
      </div>

      {/* STATS SECTION */}
      <div className="mt-20 px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center border border-gray-200"
              >
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">{stat.value}</h2>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEALS CAROUSEL */}
      <div className="mt-20 bg-white py-16">
        <div className="max-w-7xl mx-auto px-16">
          <DealsCarousel />
        </div>
      </div>

      {/* COLLECTIONS SECTION */}
      <ScrollSection
        title="Handpicked Collections for You"
        data={collections}
        onCardClick={handleExploreClick}
      />

      {/* WONDERS SECTION */}
      <ScrollSection
        title="Unlock Lesser-Known Wonders of India"
        data={wonders}
        onCardClick={handleExploreClick}
      />

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-16 text-center">

          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            Why Choose TravelBuddy?
          </h2>
          <p className="text-gray-600 mb-12 text-base">
            We're committed to making your travel experience exceptional
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Best Prices</h3>
              <p className="text-sm text-gray-600">
                Guaranteed competitive rates with no hidden fees
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Secure Booking</h3>
              <p className="text-sm text-gray-600">
                256-bit SSL encryption for safe payments
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">🎧</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">24/7 Support</h3>
              <p className="text-sm text-gray-600">
                Round-the-clock customer service via chat & phone
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="text-3xl mb-4">✓</div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Easy Cancellation</h3>
              <p className="text-sm text-gray-600">
                Free cancellation on most bookings up to 24h
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="py-20 px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-3 text-center">
            Popular Destinations
          </h2>
          <p className="text-gray-600 mb-12 text-center text-base">
            Discover the most loved travel spots across the globe
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <div
                key={index}
                onClick={() => handleExploreClick(destination)}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 group cursor-pointer"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg text-gray-800 mb-3">{destination.name}</h3>
                  <button
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-16"></div>
    </div>
  );
};

export default Home;
