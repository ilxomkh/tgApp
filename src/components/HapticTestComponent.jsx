import React from 'react';
import { 
  lightImpact, 
  mediumImpact, 
  heavyImpact, 
  notificationSuccess, 
  notificationError, 
  notificationWarning, 
  selectionChanged 
} from '../utils/hapticFeedback';

const HapticTestComponent = () => {
  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Haptic Feedback Test</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={lightImpact}
          className="p-3 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-colors"
        >
          Light Impact
        </button>
        
        <button
          onClick={mediumImpact}
          className="p-3 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors"
        >
          Medium Impact
        </button>
        
        <button
          onClick={heavyImpact}
          className="p-3 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition-colors"
        >
          Heavy Impact
        </button>
        
        <button
          onClick={selectionChanged}
          className="p-3 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors"
        >
          Selection Changed
        </button>
        
        <button
          onClick={notificationSuccess}
          className="p-3 bg-emerald-100 text-emerald-800 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
        >
          Success
        </button>
        
        <button
          onClick={notificationError}
          className="p-3 bg-orange-100 text-orange-800 rounded-lg font-medium hover:bg-orange-200 transition-colors"
        >
          Error
        </button>
        
        <button
          onClick={notificationWarning}
          className="p-3 bg-yellow-100 text-yellow-800 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
        >
          Warning
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Инструкция:</strong> Нажмите на кнопки выше, чтобы протестировать различные типы вибрации. 
          Вибрация будет работать только в Telegram WebApp.
        </p>
      </div>
    </div>
  );
};

export default HapticTestComponent;

