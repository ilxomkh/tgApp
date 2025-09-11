import React from 'react';
import { HomeIcon, UsersIcon, TicketIcon, UserIcon } from './icons';
import { useHapticClick } from '../../utils/hapticFeedback';
import { useKeyboard } from '../../hooks/useKeyboard';

const mapIcon = {
  home: HomeIcon,
  invite: UsersIcon,
  lottery: TicketIcon,
  profile: UserIcon
};

const BottomNav = ({ tabs, activeTab, onChange }) => {
  const hapticOnChange = useHapticClick(onChange, 'selection');
  const { isKeyboardOpen } = useKeyboard();

  // Скрываем навигацию когда открыта клавиатура
  if (isKeyboardOpen) {
    return null;
  }

  return (
  <div className="fixed bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom)]">
    <div className="mx-auto max-w-md px-3">
      <nav
        className="
          mb-3 rounded-2xl border border-[#E6E6F5]
          bg-white text-[#7A7A8F] shadow-[0_10px_30px_rgba(40,40,80,0.12)]
        "
        role="tablist"
        aria-label="Bottom navigation"
      >
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = mapIcon[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => hapticOnChange(tab.id)}
                role="tab"
                aria-selected={isActive}
                title={tab.label}
                className={`
                  relative flex flex-col items-center justify-center
                  py-3 transition-colors
                  ${isActive ? 'text-[#5E5AF6]' : 'text-[#7A7A8F] hover:text-[#5E5AF6]'}
                `}
              >
                {/* легкая подсветка активного */}
                <span
                  aria-hidden
                  className={`
                    pointer-events-none absolute inset-x-6 bottom-1 h-1 rounded-full
                    ${isActive ? 'bg-[#5E5AF6]' : 'bg-transparent'}
                  `}
                />
                <span className="inline-flex items-center justify-center">
                  <Icon active={isActive} />
                </span>
                <span className="mt-1 text-[11px] font-semibold leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  </div>
  );
};

export default BottomNav;
