import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, Star, Calendar, ArrowRight, Search, Plane, Hotel, Train, Car, Headphones, Shield, Award, Heart, Globe, Sparkles, Compass } from 'lucide-react';
import { handleBooking } from '../utils/handleBooking';
import { AuthContext } from '../context/AuthContext';
import AdminEditButton from '../components/AdminEditButton';
import EditServiceModal from '../components/EditServiceModal';
import AdminAddButton from '../components/AdminAddButton';

const PackagesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passengers = searchParams.get('passengers') || '1';

  const { user } = useContext(AuthContext);
  const [editingPkg, setEditingPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (pkg) => {
    setEditingPkg(pkg);
    setShowModal(true);
  };

  const packages = [
    {
      id: 1,
      title: 'Goa Beach & Nightlife Package',
      location: 'Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a7f40cc0758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days / 3 Nights',
      price: 18500,
      originalPrice: 25000,
      rating: 4.7,
      reviews: 1250,
      highlights: ['Hotel Stay', 'Transfers', 'Meals', 'Sightseeing'],
      type: 'Leisure',
      discount: 26,
      isTopPick: true,
    },
    {
      id: 2,
      title: 'Kerala Backwaters Delight',
      location: 'Kerala',
      image: 'https://images.unsplash.com/photo-1590059843335-2c27e07112a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 24500,
      originalPrice: 32000,
      rating: 4.9,
      reviews: 980,
      highlights: ['Houseboat', 'Ayurveda', 'Tea Gardens', 'Cultural Shows'],
      type: 'Nature',
      discount: 23,
      isTopPick: true,
    },
    {
      id: 3,
      title: 'Rajasthan Royal Heritage',
      location: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 32000,
      originalPrice: 42000,
      rating: 4.8,
      reviews: 756,
      highlights: ['Palace Hotels', 'Desert Safari', 'Fort Visits', 'Folk Dance'],
      type: 'Heritage',
      discount: 24,
      isTopPick: false,
    },
    {
      id: 4,
      title: 'Himalayan Adventure Pack',
      location: 'Manali & Shimla',
      image: 'https://images.unsplash.com/photo-1605590423641-845885581e61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '7 Days / 6 Nights',
      price: 28500,
      originalPrice: 35000,
      rating: 4.6,
      reviews: 543,
      highlights: ['Snow Activities', 'Trekking', 'Sightseeing', 'Hotel Stay'],
      type: 'Adventure',
      discount: 19,
      isTopPick: false,
    },
    {
      id: 5,
      title: 'Bali Romantic Escape',
      location: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 38000,
      originalPrice: 48000,
      rating: 4.9,
      reviews: 892,
      highlights: ['Resort Stay', 'Spa', 'Temple Visit', 'Dinner Cruise'],
      type: 'Romantic',
      discount: 21,
      isTopPick: true,
    },
    {
      id: 6,
      title: 'Thailand Budget Tour',
      location: 'Bangkok + Pattaya',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 22000,
      originalPrice: 28000,
      rating: 4.5,
      reviews: 1560,
      highlights: ['Hotel', 'Transfers', 'Sightseeing', 'Meals'],
      type: 'Budget',
      discount: 21,
      isTopPick: false,
    },
    {
      id: 7,
      title: 'Kashmir Paradise Tour',
      location: 'Srinagar & Gulmarg',
      image: 'https://images.unsplash.com/photo-1587729927502-0656c9f75893?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days / 4 Nights',
      price: 26500,
      originalPrice: 33000,
      rating: 4.7,
      reviews: 678,
      highlights: ['Houseboat', 'Garden Visits', 'Gondola Ride', 'Sightseeing'],
      type: 'Nature',
      discount: 20,
      isTopPick: false,
    },
    {
      id: 8,
      title: 'Singapore & Malaysia Combo',
      location: 'Singapore + Kuala Lumpur',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days / 5 Nights',
      price: 42000,
      originalPrice: 55000,
      rating: 4.8,
      reviews: 945,
      highlights: ['City Tour', 'Universal Studios', 'Night Safari', 'Cruise'],
      type: 'International',
      discount: 24,
      isTopPick: true,
    },
  ];

  const bestOffers = packages.filter(pkg => pkg.discount >= 20).slice(0, 4);

  const features = [
    { icon: Compass, title: 'Personalized Matching', description: 'AI-powered recommendations tailored just for you' },
    { icon: Globe, title: 'Wide Variety of Destinations', description: 'Explore 100+ destinations worldwide' },
    { icon: Shield, title: 'Highly Qualified Service', description: 'Certified professionals at every step' },
    { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock assistance wherever you travel' },
    { icon: Heart, title: 'Handpicked Hotels', description: 'Carefully selected accommodations for comfort' },
    { icon: Award, title: 'Best Price Guarantee', description: 'We match any competitor price' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/10 to-purple-50/10">
      {/* Wave Divider SVG (used multiple times) */}
      <svg className="absolute bottom-0 left-0 w-full h-24 text-white-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
      </svg>

      {/* HERO SECTION */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Travel Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Explore Dream Packages
            </h1>
            <p className="text-xl text-white/90 mb-10 font-light">
              Discover handpicked travel experiences crafted just for you
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full pl-12 pr-6 py-5 rounded-full text-gray-900 placeholder-gray-500 shadow-2xl border-0 focus:outline-none focus:ring-4 focus:ring-blue-300/50 text-lg"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                  Search
                </button>
              </div>

              {/* Quick Destination Chips */}
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {['Goa', 'Kerala', 'Rajasthan', 'Bali', 'Thailand', 'Kashmir'].map((dest) => (
                  <button
                    key={dest}
                    className="px-5 py-2 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" className="text-gray-50" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* BEST OFFERS SECTION */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 via-yellow-50/50 to-orange-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 relative flex items-center justify-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Best Offers</h2>
              <p className="text-lg text-gray-600">Exclusive deals you won&apos;t find elsewhere</p>
            </div>
            {user?.role?.toLowerCase() === 'admin' && (
              <div className="absolute right-0">
                <AdminAddButton label="Add Package" onClick={() => { setEditingPkg(null); setShowModal(true); }} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestOffers.map((pkg) => (
              <div
                key={pkg.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-orange-100 cursor-pointer"
                onClick={() => navigate(`/package-details?passengers=${passengers}`, { state: { pkg } })}
              >
                {user?.role?.toLowerCase() === 'admin' && (
                  <AdminEditButton onClick={() => handleEdit(pkg)} />
                )}
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{pkg.type}</span>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-900">{pkg.rating}</span>
                      <span className="text-xs text-gray-400">({pkg.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.location}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-400 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                      <div className="flex items-baseline space-x-1">
                        <IndianRupee className="h-4 w-4 text-orange-500" />
                        <span className="text-2xl font-bold text-orange-600">{pkg.price.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-400">per person</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBooking(navigate, 'package', pkg); }}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PACKAGES SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 relative flex items-center justify-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">All Packages</h2>
              <p className="text-lg text-gray-600">Curated experiences for every type of traveler</p>
            </div>
            {user?.role?.toLowerCase() === 'admin' && (
              <div className="absolute right-0">
                <AdminAddButton label="Add Package" onClick={() => { setEditingPkg(null); setShowModal(true); }} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/package-details?passengers=${passengers}`, { state: { pkg } })}
              >
                {user?.role?.toLowerCase() === 'admin' && (
                  <AdminEditButton onClick={() => handleEdit(pkg)} />
                )}
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
                    {pkg.type}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{pkg.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.location}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-400 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-md font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                      <div className="flex items-baseline space-x-1">
                        <IndianRupee className="h-4 w-4 text-gray-400" />
                        <span className="text-xl font-bold text-gray-900">{pkg.price.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-400">per person</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBooking(navigate, 'package', pkg); }}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Choose TravelBuddy?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We go above and beyond to make your travel dreams come true with premium services and unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave Divider Before Footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="1" className="text-gray-50" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      {/* Edit Modal */}
      <EditServiceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingPkg(null); }}
        serviceType="package"
        item={editingPkg}
        onSave={() => {}}
      />
    </div>
  );
};

export default PackagesPage;
