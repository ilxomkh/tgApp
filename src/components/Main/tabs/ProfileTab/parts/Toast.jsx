import React from 'react';

const Toast = ({ open, children }) => {
  return (
    <div
      className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out pointer-events-none
        ${open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
      style={{
        bottom: `calc(128px + env(safe-area-inset-bottom))`
      }}
    >
      {open && (
        <div className="bg-gray-900/95 text-white px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-700 flex items-center gap-3 max-w-sm animate-bounce-in">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="font-medium">{children}</span>
        </div>
      )}
    </div>
  );
};

export default Toast;
