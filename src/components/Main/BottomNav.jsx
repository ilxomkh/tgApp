// tg-app/src/components/Main/BottomNav.jsx
import React from 'react';

const BottomNav = ({ tabs, activeTab, onChange }) => (
  <div className="fixed bottom-0 left-0 right-0 z-20">
    <div className="mx-auto max-w-md">
      <nav
        className="
          mx-3 mb-3 rounded-2xl border border-emerald-200/50
          bg-emerald-600/90 text-white backdrop-blur-md
          shadow-[0_10px_30px_rgba(16,185,129,0.35)]
          pb-[env(safe-area-inset-bottom)]
        "
        role="tablist"
        aria-label="Bottom navigation"
      >
        <div className={`grid grid-cols-4`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                role="tab"
                aria-selected={isActive}
                title={tab.label}
                className={`
                  group relative flex flex-col items-center justify-center
                  px-2 py-2.5 sm:py-3
                  transition-colors duration-200
                  focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-600/90
                  ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}
                `}
              >
                {/* Active highlight pill (исправлено: не во всю высоту, не перехватывает клики) */}
                <span
                  aria-hidden
                  className={`
                    pointer-events-none absolute inset-x-1 top-1 bottom-1
                    rounded-xl transition-opacity duration-200
                    ${isActive ? 'opacity-100 bg-white/12' : 'opacity-0 group-hover:opacity-10 bg-white/10'}
                  `}
                />

                {/* Icon */}
                <span className="inline-flex items-center justify-center">
                  <Icon active={isActive} size={22} className="block" />
                </span>

                {/* Label (исправлено: перенос до 2 строк, центрирование и компактный line-height) */}
                <span
                  className={`
                    mt-1 text-[10.5px] sm:text-[11px] font-semibold tracking-wide
                    text-center leading-tight px-1
                    line-clamp-2
                    ${isActive ? 'opacity-100' : 'opacity-95'}
                  `}
                >
                  {tab.label}
                </span>

                {/* Active underline (исправлено: позиция и видимость) */}
                <span
                  aria-hidden
                  className={`
                    pointer-events-none absolute left-8 right-8 bottom-1
                    h-1 rounded-full transition-opacity duration-200
                    ${isActive ? 'bg-white/90 opacity-100' : 'opacity-0'}
                  `}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  </div>
);

export default BottomNav;
