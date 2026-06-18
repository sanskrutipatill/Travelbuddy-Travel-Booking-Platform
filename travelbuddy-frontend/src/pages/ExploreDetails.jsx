import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, Star, Clock, Map, Sparkles } from 'lucide-react';

const ExploreDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  const [guestsCount, setGuestsCount] = useState(1);

  useEffect(() => {
    if (!item) {
      toast.error('Item information not found');
      navigate('/');
    }
  }, [item, navigate]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const pricePerPerson = item.price || 5000;
  const totalAmount = pricePerPerson * guestsCount;

  const getHighlights = () => {
    const type = item.type || 'destination';
    switch (type) {
      case 'package':
        return ['Accommodation included', 'Meals covered', 'Sightseeing tours', 'Travel insurance', 'Airport transfers'];
      case 'tour':
        return ['Expert guide', 'Small group', 'All entry fees', 'Transport included', 'Photo opportunities'];
      case 'destination':
      default:
        return ['Best time to visit', 'Top attractions', 'Local cuisine', 'Travel tips', 'Hidden gems'];
    }
  };

  const handleBookNow = () => {
    const totalAmount = pricePerPerson * guestsCount;

    // Route to appropriate checkout based on type
    if (item.type === 'hotel') {
      navigate('/hotel-checkout', {
        state: {
          hotel: {
            ...item,
            name: item.title || item.name,
            location: item.location,
          },
          totalAmount,
          guests: guestsCount,
        },
      });
    } else if (item.type === 'package') {
      navigate('/package-checkout', {
        state: {
          pkg: {
            ...item,
            name: item.title || item.name,
            location: item.location,
          },
          totalAmount,
          travellers: guestsCount,
        },
      });
    } else if (item.type === 'tour') {
      navigate('/tour-checkout', {
        state: {
          tour: {
            ...item,
            name: item.title || item.name,
            location: item.location,
          },
          totalAmount,
          travellers: guestsCount,
        },
      });
    } else {
      // For other types (destination, etc.) use generic checkout
      navigate('/checkout', {
        state: {
          type: item.type || 'package',
          data: {
            ...item,
            name: item.title || item.name,
            location: item.location,
            price: totalAmount, // pass total as basePrice since generic checkout won't multiply for non-flight/train
          },
          passengers: guestsCount,
        },
      });
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title || item.name || 'Explore Destination'}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{item.location || item.destination || 'India'}</span>
                </div>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{item.rating}</span>
                    <span className="text-gray-400">({item.reviews || 0} reviews)</span>
                  </div>
                )}
                {item.tag && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{item.category || item.type || 'Travel'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {item.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Experience</h2>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            )}

            {/* Highlights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Highlights</h2>
              <div className="grid grid-cols-2 gap-4">
                {getHighlights().map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration & Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Details</h2>
              <div className="grid grid-cols-2 gap-6">
                {item.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{item.duration}</p>
                    </div>
                  </div>
                )}
                {item.destination && (
                  <div className="flex items-center gap-3">
                    <Map className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-semibold">{item.destination}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
              <p className="text-gray-600 mb-2">
                Free cancellation up to 7 days before the experience start date. Cancellations made within 7 days are eligible for a 50% refund.
              </p>
            </div>
          </div>

          {/* Right: Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Experience</h3>

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

export default ExploreDetails;
