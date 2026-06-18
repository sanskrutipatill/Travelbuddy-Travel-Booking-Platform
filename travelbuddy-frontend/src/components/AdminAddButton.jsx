import React from 'react';
import { Plus } from 'lucide-react';

const AdminAddButton = ({ onClick, label = "Add New" }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
      title={label}
    >
      <Plus className="w-4 h-4" /> <span>{label}</span>
    </button>
  );
};

export default AdminAddButton;
