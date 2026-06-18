/**
 * Global booking handler - use this for ALL "Book" or "Book Now" buttons
 *
 * @param {Function} navigate - useNavigate hook from react-router-dom
 * @param {string} type - Service type: 'flight', 'hotel', 'train', 'cab', 'package', 'tour'
 * @param {Object} item - The service item object to book (must have price field)
 * @param {Object} options - Optional options
 * @param {number} options.passengers - Number of passengers (for flights/trains)
 *
 * @example
 * onClick={() => handleBooking(navigate, 'flight', flight)}
 * onClick={() => handleBooking(navigate, 'hotel', hotel, { passengers: 2 })}
 */
export const handleBooking = (navigate, type, item, options = {}) => {
  const { passengers = 1 } = options;
  console.log("handleBooking called with:", { type, item, passengers });
  // For train bookings, there's a separate TrainCheckout page; use that if needed
  if (type === 'train') {
    navigate('/train-checkout', {
      state: {
        train: item,
        passengers,
        date: item.date || new Date().toISOString().split('T')[0],
      },
    });
  } else {
    navigate('/checkout', {
      state: {
        type,
        data: item,
        passengers,
      },
    });
  }
};

// Helper: Get price from various field names
export const getPrice = (item) => {
  return item.price || item.fare || item.amount || item.totalPrice || item.cost || 0;
};

// Helper: Get display title
export const getTitle = (item) => {
  return item.name || item.title || item.airline || item.hotelName || item.trainName || 'Unknown';
};

// Helper: Get route/location info
export const getRoute = (item) => {
  if (item.source && item.destination) {
    return `${item.source} → ${item.destination}`;
  }
  if (item.pickup && item.drop) {
    return `${item.pickup} → ${item.drop}`;
  }
  if (item.location) {
    return item.location;
  }
  return '';
};
