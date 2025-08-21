// tg-app/src/components/Main/ui.jsx
import React from 'react';

export const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ${className}`}>
    {children}
  </div>
);

export const GradientCard = ({ children, from = 'from-emerald-500', to = 'to-teal-600', className = '' }) => (
  <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${from} ${to} shadow-[0_20px_40px_rgba(16,185,129,0.35)] ${className}`}>
    {children}
  </div>
);

export const CTAButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full h-12 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.99] transition ${className}`}
  >
    {children}
  </button>
);

export const SoftButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full h-12 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 active:scale-[0.99] transition ${className}`}
  >
    {children}
  </button>
);

export function FieldRow({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}

export function StatPill({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 flex flex-col shadow-[0_6px_20px_rgba(2,6,23,0.04)]">
      <span className="text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-base font-semibold text-gray-900">{value}</span>
    </div>
  );
}
