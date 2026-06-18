import React from 'react';

const SearchSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Service Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-1 p-2 min-w-max">
            {['Flights', 'Hotels', 'Packages', 'Trains', 'Cabs', 'Tours'].map((tab) => (
              <button
                key={tab}
                type="button"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 transition-all"
              >
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6">
          <form>
            {/* Trip Type */}
            <div className="flex items-center space-x-2 mb-6">
              {['One Way', 'Round Trip', 'Multi City'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border hover:border-blue-200 border border-transparent transition-all"
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* From */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter city.."
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Swap */}
              <div className="md:col-span-1 flex justify-center pb-2.5">
                <button
                  type="button"
                  className="p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter city.."
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Departure */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Departure
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Return */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Return
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Travellers */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Travellers & Class
                </label>
                <select className="w-full pl-4 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 text-sm bg-white appearance-none">
                  <option>1 Adult, Economy</option>
                  <option>2 Adults, Economy</option>
                  <option>3 Adults, Economy</option>
                  <option>4 Adults, Economy</option>
                  <option>1 Adult, Business</option>
                  <option>2 Adults, Business</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                >
                  SEARCH
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
