import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CLASS_OPTIONS = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Premium Economy', label: 'Premium Economy' },
  { value: 'Business', label: 'Business' },
];

const ClassSelector = ({ value, onChange, className = '', id, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find selected option label
  const selectedOption = CLASS_OPTIONS.find((opt) => opt.value === value) || CLASS_OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {!compact && (
        <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">
          Class
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${compact ? 'px-3 py-2 h-11' : 'px-3 py-2 h-11'} text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-400 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
      >
        <span className="text-gray-900 truncate">{selectedOption.label}</span>
        <ChevronDown className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {CLASS_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${
                value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassSelector;
