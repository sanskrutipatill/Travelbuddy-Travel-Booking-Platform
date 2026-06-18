import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowRightLeft, ChevronDown, Calendar, User, RotateCcw } from 'lucide-react';

import ClassSelector from './ClassSelector';
import LocationInput from './LocationInput';
import TravellerSelector from './TravellerSelector';

const TopSearchBar = ({ initialValues = {}, onTravellersChange, defaultRoute = 'flights' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [source, setSource] = useState(initialValues.source || searchParams.get('source') || '');
  const [destination, setDestination] = useState(initialValues.destination || searchParams.get('destination') || '');
  const [departureDate, setDepartureDate] = useState(initialValues.date || searchParams.get('date') || '');
  const [returnDate, setReturnDate] = useState(initialValues.returnDate || searchParams.get('returnDate') || '');
  const [travelClass, setTravelClass] = useState(initialValues.class || searchParams.get('class') || 'Economy');

  const [travellers, setTravellers] = useState({
    adults: initialValues.passengers || parseInt(searchParams.get('passengers')) || 1,
    children: 0,
  });

  const [showTravellerModal, setShowTravellerModal] = useState(false);

  // Notify parent when travellers change
  React.useEffect(() => {
    if (onTravellersChange) {
      onTravellersChange(travellers.adults);
    }
  }, [travellers.adults, onTravellersChange]);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    if (destination) params.append('destination', destination);
    if (departureDate) params.append('date', departureDate);
    if (travellers.adults) params.append('passengers', travellers.adults.toString());
    navigate(`/results/${defaultRoute}?${params.toString()}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-5 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3 justify-between">
          
          {/* FROM BOX */}
          <div className="flex-1 min-w-[200px] max-w-[280px]">
            <label className="block text-[11px] font-bold text-gray-400 mb-1 ml-1 uppercase">From</label>
            <div className="border border-gray-300 rounded-md h-11 flex items-center bg-white hover:border-gray-400 focus-within:border-blue-500 overflow-hidden transition-all">
              <LocationInput value={source} onChange={setSource} placeholder="City.." showGps={true} compact={true} />
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="pb-2.5">
            <button type="button" onClick={handleSwap} className="text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO BOX */}
          <div className="flex-1 min-w-[200px] max-w-[280px]">
            <label className="block text-[11px] font-bold text-gray-400 mb-1 ml-1 uppercase">To</label>
            <div className="border border-gray-300 rounded-md h-11 flex items-center bg-white hover:border-gray-400 focus-within:border-blue-500 overflow-hidden transition-all">
              <LocationInput value={destination} onChange={setDestination} placeholder="City.." showGps={false} compact={true} />
            </div>
          </div>

          {/* DEPARTURE */}
          <div className="w-[160px]">
            <label className="block text-[11px] font-bold text-gray-400 mb-1 ml-1 uppercase">Departure</label>
            <div className="border border-gray-300 rounded-md h-11 flex items-center px-3 bg-white hover:border-gray-400 transition-all">
              <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="text-xs font-bold outline-none w-full bg-transparent" />
            </div>
          </div>

          {/* RETURN */}
          <div className="w-[160px]">
            <label className="block text-[11px] font-bold text-gray-400 mb-1 ml-1 uppercase">Return</label>
            <div className="border border-gray-300 rounded-md h-11 flex items-center px-3 bg-white hover:border-gray-400 transition-all">
              <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="text-xs font-bold outline-none w-full bg-transparent" />
            </div>
          </div>

          {/* TRAVELLERS */}
          <div className="w-[120px]">
            <label className="block text-[11px] font-bold text-gray-400 mb-1 ml-1 uppercase">Travellers</label>
            <button type="button" onClick={() => setShowTravellerModal(true)} className="w-full border border-gray-300 rounded-md h-11 flex items-center justify-between px-3 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-1"><User className="w-3 h-3 text-gray-400" /> {travellers.adults} P</div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* CLASS */}
          <div className="w-[140px]">
            <label className="block text-[11px] font-bold text-gray-400 mb-1 ml-1 uppercase">Class</label>
            <ClassSelector value={travelClass} onChange={setTravelClass} compact={true} className="!border-gray-300 !rounded-md !text-xs !font-bold !text-gray-700" />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button type="submit" className="h-11 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
              <Search className="w-4 h-4" /> SEARCH
            </button>
            <button type="button" onClick={() => window.location.reload()} className="h-11 w-11 border border-gray-300 rounded-md flex items-center justify-center bg-white hover:bg-gray-50 transition-all">
              <RotateCcw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

        </form>
      </div>

      <TravellerSelector isOpen={showTravellerModal} onClose={() => setShowTravellerModal(false)} onSave={setTravellers} initialValues={travellers} />
    </div>
  );
};

export default TopSearchBar;