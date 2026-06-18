import React, { useMemo } from 'react';
import { Info } from 'lucide-react';

const SortBar = ({ flights = [], currentSort, onSortChange }) => {
  // Calculate cheapest price
  const minPrice = useMemo(() => {
    if (!flights.length) return 0;
    return Math.min(...flights.map(f => f.price));
  }, [flights]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm flex justify-between items-center px-4 py-3">
      {/* Left: Best selectable card (70% width) */}
      <div className="w-[70%]">
        <div
          className={`rounded-lg px-6 py-3 cursor-pointer border-2 transition-all ${
            currentSort === 'best'
              ? 'border-blue-600 bg-blue-50'
              : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onSortChange('best')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSortChange('best');
            }
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${currentSort === 'best' ? 'text-blue-600' : 'text-gray-700'}`}>
              Best
            </span>
            <Info className={`w-4 h-4 ${currentSort === 'best' ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
        </div>
      </div>

      {/* Right: Cheapest info text (30% width) */}
      <div className="w-[30%] text-right">
        <span className="text-sm text-gray-600">Cheapest from </span>
        <span className={`text-base font-bold ${flights.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
          {flights.length > 0 ? formatPrice(minPrice) : '—'}
        </span>
      </div>
    </div>
  );
};

export default SortBar;
