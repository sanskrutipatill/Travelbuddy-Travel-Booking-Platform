import React from 'react';

/**
 * AdminEditButton - A reusable edit button for admin users.
 * Matches requested style: circular, white bg, shadow, absolute positioning.
 */
const AdminEditButton = ({ onClick, className }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      className={className || "absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 z-20 flex items-center justify-center border border-gray-100"}
      title="Edit item"
    >
      <span className="text-base leading-none">✏️</span>
    </button>
  );
};

export default AdminEditButton;
