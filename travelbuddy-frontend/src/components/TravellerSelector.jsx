import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';

const TravellerSelector = ({ isOpen, onClose, onSave, initialValues = { adults: 1, children: 0, infantsSeat: 0, infantsLap: 0 } }) => {
  const [travellers, setTravellers] = useState(initialValues);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setTravellers(initialValues);
    }
  }, [isOpen, initialValues]);

  const updateCount = (type, delta) => {
    setTravellers((prev) => {
      const newValue = { ...prev, [type]: prev[type] + delta };

      // Validation: at least 1 adult
      if (newValue.adults < 1) {
        return prev;
      }

      // Maximum limits
      if (newValue.adults > 9) newValue.adults = 9;
      if (newValue.children > 9) newValue.children = 9;
      if (newValue.infantsSeat > 9) newValue.infantsSeat = 9;
      if (newValue.infantsLap > 9) newValue.infantsLap = 9;

      // Infants cannot exceed adults
      const totalInfants = newValue.infantsSeat + newValue.infantsLap;
      if (totalInfants > newValue.adults) {
        // Reduce infants proportionally
        if (type === 'infantsSeat' && delta > 0) {
          newValue.infantsSeat = prev.infantsSeat;
        } else if (type === 'infantsLap' && delta > 0) {
          newValue.infantsLap = prev.infantsLap;
        }
      }

      return newValue;
    });
  };

  const handleSave = () => {
    onSave(travellers);
    onClose();
  };

  const getSummary = () => {
    const parts = [];
    if (travellers.adults > 0) parts.push(`${travellers.adults} Adult${travellers.adults > 1 ? 's' : ''}`);
    if (travellers.children > 0) parts.push(`${travellers.children} Child${travellers.children > 1 ? 'ren' : ''}`);
    if (travellers.infantsSeat > 0) parts.push(`${travellers.infantsSeat} Infant${travellers.infantsSeat > 1 ? 's' : ''} (seat)`);
    if (travellers.infantsLap > 0) parts.push(`${travellers.infantsLap} Infant${travellers.infantsLap > 1 ? 's' : ''} (lap)`);
    return parts.join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Travellers</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Adults</div>
              <div className="text-sm text-gray-500">Age 18+</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('adults', -1)}
                disabled={travellers.adults <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 w-8 text-center">{travellers.adults}</span>
              <button
                onClick={() => updateCount('adults', 1)}
                disabled={travellers.adults >= 9}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Children</div>
              <div className="text-sm text-gray-500">Age 2-17</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('children', -1)}
                disabled={travellers.children <= 0}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 w-8 text-center">{travellers.children}</span>
              <button
                onClick={() => updateCount('children', 1)}
                disabled={travellers.children >= 9}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Infants with seat */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Infants (seat)</div>
              <div className="text-sm text-gray-500">Under 2 years with own seat</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('infantsSeat', -1)}
                disabled={travellers.infantsSeat <= 0}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 w-8 text-center">{travellers.infantsSeat}</span>
              <button
                onClick={() => updateCount('infantsSeat', 1)}
                disabled={travellers.infantsSeat >= 9 || travellers.infantsSeat + travellers.infantsLap >= travellers.adults}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Infants on lap */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Infants (lap)</div>
              <div className="text-sm text-gray-500">Under 2 years without own seat</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCount('infantsLap', -1)}
                disabled={travellers.infantsLap <= 0}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 w-8 text-center">{travellers.infantsLap}</span>
              <button
                onClick={() => updateCount('infantsLap', 1)}
                disabled={travellers.infantsLap >= 9 || travellers.infantsSeat + travellers.infantsLap >= travellers.adults}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Info note */}
          {(travellers.infantsSeat + travellers.infantsLap) >= travellers.adults && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              Note: Each infant must be accompanied by at least one adult.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 font-medium border-r border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravellerSelector;
