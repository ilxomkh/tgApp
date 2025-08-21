import React from 'react';

const RowButton = ({ icon, label, onClick, isLast = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-2xl transition-all duration-300 flex items-center justify-between
        hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 active:scale-[0.98]
        active:bg-gradient-to-r active:from-emerald-100 active:to-blue-100 group
        ${!isLast ? 'border-b border-gray-100' : ''} ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
          <div className="text-emerald-700 group-hover:text-emerald-800 transition-colors">
            {icon}
          </div>
        </div>
        <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </div>

      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
        <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};

export default RowButton;
