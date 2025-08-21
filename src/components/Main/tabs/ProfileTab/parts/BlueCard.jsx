import React from 'react';

const BlueCard = ({ title, children }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="relative">
        <h4 className="font-bold text-blue-900 mb-3 text-lg">{title}</h4>
        <div className="text-blue-800/90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default BlueCard;
