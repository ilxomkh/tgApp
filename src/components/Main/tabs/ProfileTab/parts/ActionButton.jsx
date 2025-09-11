import React from 'react';
import { useHapticClick } from '../../../../utils/hapticFeedback';

const ActionButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-emerald-500/25',
    blue:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25',
  };

  const hapticOnClick = useHapticClick(onClick, 'medium');

  return (
    <button
      onClick={hapticOnClick}
      className={`w-full h-14 rounded-2xl font-semibold transition-all duration-300 active:scale-[0.98] hover:shadow-xl ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
