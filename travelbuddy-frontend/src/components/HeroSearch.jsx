import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft, Calendar, Users } from 'lucide-react';

const tripTypes = [
  { id: 'oneway', label: 'One Way' },
  { id: 'roundtrip', label: 'Round Trip' },
  { id: 'multicity', label: 'Multi City' },
];

const HeroSearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState('1');

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const route = `/${activeTab}`;
    const query = new URLSearchParams();
    if (from) query.append('source', from);
    if (to) query.append('destination', to);
    if (departure) query.append('date', departure);
    if (tripType === 'roundtrip' && returnDate) {
      query.append('returnDate', returnDate);
    }
    query.append('travelers', travelers);
    navigate(`${route}?${query.toString()}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tab Bar */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-1 p-2 min-w-max">
              {['flights', 'hotels', 'packages', 'trains', 'cabs', 'tours'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">{tab.replace(/([A-Z])/g, ' $1').trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <div className="p-8">
            <form onSubmit={handleSearch}>
              {/* Trip Type */}
              {activeTab === 'flights' && (
                <div className="flex items-center space-x-3 mb-8">
                  {tripTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setTripType(type.id)}
                      className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        tripType === type.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                {/* From */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter city.."
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Swap */}
                <div className="md:col-span-1 flex justify-center pb-[10px]">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </button>
                </div>

                {/* To */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter city.."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Departure */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Departure
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Return (only for round trip) */}
                {tripType === 'roundtrip' && activeTab === 'flights' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Return
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Travellers */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Travellers
                  </label>
                  <div className="relative">
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm bg-white appearance-none"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                      <option value="1-child">1 Adult, 1 Child</option>
                      <option value="2-children">2 Adults, 1 Child</option>
                    </select>
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>SEARCH</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
