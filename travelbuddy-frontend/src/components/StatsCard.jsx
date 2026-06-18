import React from 'react';

const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  bgColor = 'bg-indigo-50',
}) => {
  return (
    <div className="group relative bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1.5">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">
            {value}
          </h3>
          {change && (
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center text-xs font-semibold rounded-full px-2 py-0.5 ${
                  changeType === 'positive'
                    ? 'bg-emerald-100 text-emerald-700'
                    : changeType === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {changeType === 'positive' && '+'}
                {changeType === 'negative' && '-'}
                {change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3 ${bgColor} rounded-xl group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
