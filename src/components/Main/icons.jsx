// tg-app/src/components/Main/icons.jsx
import React from 'react';

export function HomeIcon({ active = false }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" fill="none">
      <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9.5Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className={active ? 'opacity-100' : 'opacity-80'} />
    </svg>
  );
}
export function UsersIcon({ active = false }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M20 21v-2a4 4 0 0 0-3-3.87M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className={active ? 'opacity-100' : 'opacity-80'} />
    </svg>
  );
}
export function TicketIcon({ active = false }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" fill="none">
      <path d="M4 8a2 2 0 0 1 2-2h8l2 2h2a2 2 0 0 1 2 2v1.5a2.5 2.5 0 0 0 0 5V18a2 2 0 0 1-2 2H8l-2-2H4a2 2 0 0 1-2-2v-1.5a2.5 2.5 0 0 0 0-5V8Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className={active ? 'opacity-100' : 'opacity-80'} />
      <path d="M14 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
export function UserIcon({ active = false }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" fill="none">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 10v-1a6 6 0 0 0-6-6H11a6 6 0 0 0-6 6v1"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className={active ? 'opacity-100' : 'opacity-80'} />
    </svg>
  );
}
export function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
