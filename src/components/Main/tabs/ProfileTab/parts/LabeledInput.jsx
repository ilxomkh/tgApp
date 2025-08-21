import React from 'react';

const LabeledInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  inputMode,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className="w-full h-14 px-4 rounded-2xl border-2 border-gray-200 bg-white placeholder:text-gray-400
                     text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                     focus:border-emerald-500 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
};

export default LabeledInput;
