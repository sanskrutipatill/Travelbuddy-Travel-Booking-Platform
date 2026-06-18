import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Hotel,
  Train,
  CarTaxiFront,
  Calendar,
  MapPin,
  Search,
  ArrowRightLeft,
} from 'lucide-react';

const SearchPanel = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'cabs', label: 'Cabs', icon: CarTaxiFront },
  ];

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (source) query.append('source', source);
    if (destination) query.append('destination', destination);
    if (date) query.append('date', date);

    navigate(`/results/${activeTab}?${query.toString()}`);
  };

  const isHotel = activeTab === 'hotels';

  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Find Your Perfect Trip
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Search and book flights, hotels, trains, and cabs
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">

                {/* Service Type Selector */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg font-medium text-xs transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* From */}
                <div className={`lg:col-span-${isHotel ? '4' : '3'}`}>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    {isHotel ? 'Location' : 'From'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={isHotel ? "Enter city or hotel name" : "Select city"}
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm text-gray-700"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                {!isHotel && (
                  <div className="lg:col-span-1">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-full h-[52px] flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                      title="Swap locations"
                    >
                      <ArrowRightLeft className="h-4 w-4 text-gray-500 hover:text-indigo-600" />
                    </button>
                  </div>
                )}

                {/* To */}
                {!isHotel && (
                  <div className="lg:col-span-2">
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Select city"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm text-gray-700"
                      />
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className={`lg:col-span-${isHotel ? '3' : '1'}`}>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    {isHotel ? 'Check-in' : 'Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm text-gray-700"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-[52px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Search</span>
                    <Search className="h-4 w-4" />
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

export default SearchPanel;
