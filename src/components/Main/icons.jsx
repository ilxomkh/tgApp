import React from "react";

export function HomeIcon({ active = false }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="shrink-0"
      fill="none"
    >
      <path
        d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "opacity-100" : "opacity-80"}
      />
      {active && (
        <path
          d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9.5Z"
          fill="currentColor"
          fillOpacity="0.2"
        />
      )}
    </svg>
  );
}

export function UsersIcon({ active = false }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="shrink-0"
      fill="none"
    >
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M20 21v-2a4 4 0 0 0-3-3.87M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "opacity-100" : "opacity-80"}
      />
      <path
        d="M18 8h2M19 7v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={active ? "opacity-100" : "opacity-80"}
      />
    </svg>
  );
}

export function TicketIcon({ active = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 57 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-80"}
    >
      <path
        d="M44.4028 6.9137H34.4022C33.0813 3.26569 29.622 0.624023 25.5337 0.624023C21.4454 0.624023 17.9861 3.26569 16.6653 6.9137H6.66468C3.20536 6.9137 0.375 9.74406 0.375 13.2034V54.0863C0.375 57.5456 3.20536 60.376 6.66468 60.376H25.8796C24.0242 58.5834 22.5147 56.4449 21.414 54.0863H6.66468V13.2034H12.9544C12.9544 16.6627 15.7847 19.4931 19.244 19.4931H31.8234C35.2827 19.4931 38.1131 16.6627 38.1131 13.2034H44.4028V22.8895C46.6356 23.204 48.7426 23.8644 50.6924 24.7764V13.2034C50.6924 9.74406 47.8621 6.9137 44.4028 6.9137ZM25.5337 13.2034C23.8041 13.2034 22.3889 11.7882 22.3889 10.0585C22.3889 8.32888 23.8041 6.9137 25.5337 6.9137C27.2634 6.9137 28.6786 8.32888 28.6786 10.0585C28.6786 11.7882 27.2634 13.2034 25.5337 13.2034Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M41.2579 28.9276C49.9377 28.9276 56.9821 35.972 56.9821 44.6518C56.9821 53.3315 49.9377 60.376 41.2579 60.376C32.5782 60.376 25.5337 53.3315 25.5337 44.6518C25.5337 35.972 32.5782 28.9276 41.2579 28.9276ZM48.0574 40.1833C47.3412 39.4678 46.1816 39.4678 45.4654 40.1833L39.4214 46.2211L37.0505 43.8502C36.3345 43.136 35.1744 43.1361 34.4584 43.8502C33.7422 44.5664 33.7426 45.7289 34.4584 46.4453L38.1254 50.1153C38.8416 50.8316 40.004 50.8312 40.7205 50.1153L48.0574 42.7753C48.773 42.0588 48.7736 40.8994 48.0574 40.1833Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UserIcon({ active = false }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="shrink-0"
      fill="none"
    >
      <path
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 10v-1a6 6 0 0 0-6-6H11a6 6 0 0 0-6 6v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "opacity-100" : "opacity-80"}
      />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M19 12H5M11 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EarthIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WalletIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white"
    >
      <path
        d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M16 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4v-4a2 2 0 0 0-2-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SettingsIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 63 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.5 0C14.112 0 0 14.112 0 31.5C0 48.888 14.112 63 31.5 63C48.888 63 63 48.888 63 31.5C63 14.112 48.888 0 31.5 0ZM31.5 9.45C36.729 9.45 40.95 13.671 40.95 18.9C40.95 24.129 36.729 28.35 31.5 28.35C26.271 28.35 22.05 24.129 22.05 18.9C22.05 13.671 26.271 9.45 31.5 9.45ZM31.5 54.18C23.625 54.18 16.6635 50.148 12.6 44.037C12.6945 37.7685 25.2 34.335 31.5 34.335C37.7685 34.335 50.3055 37.7685 50.4 44.037C46.3365 50.148 39.375 54.18 31.5 54.18Z"
        fill="white"
      />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <path d="M0 80H80V0H0V80Z" fill="url(#pattern0_102_624)" />
      <defs>
        <pattern
          id="pattern0_102_624"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlink:href="#image0_102_624" transform="scale(0.00625)" />
        </pattern>
      </defs>
    </svg>
  );
}

export function XIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AvatarIcon({ active = false, className = "" }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill="none"
    >
      <path
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 10v-1a6 6 0 0 0-6-6H11a6 6 0 0 0-6 6v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "opacity-100" : "opacity-80"}
      />
    </svg>
  );
}

export function AppleIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function AndroidIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4119 13.8533 7.8508 12 7.8508s-3.5902.5611-5.1367 1.5559L4.841 5.9037a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
    </svg>
  );
}

export function LaptopIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function FlagUzIcon({ className = "" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
      <rect width="24" height="16" fill="#1EB53A" />
      <rect width="24" height="5.33" fill="#0099B5" />
      <rect y="10.67" width="24" height="5.33" fill="#CE1126" />
      <path d="M0 0h8v16H0z" fill="#fff" />
      <circle cx="4" cy="8" r="2.5" fill="#1EB53A" />
      <circle cx="4" cy="8" r="1.5" fill="#fff" />
      <circle cx="4" cy="8" r="0.5" fill="#1EB53A" />
    </svg>
  );
}

export function FlagRuIcon({ className = "" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
      <rect width="24" height="8" fill="#fff" />
      <rect y="8" width="24" height="8" fill="#0039A6" />
      <rect y="16" width="24" height="8" fill="#D52B1E" />
    </svg>
  );
}

export function FlagUsIcon({ className = "" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
      <rect width="24" height="16" fill="#B22234" />
      <rect width="24" height="1.23" fill="#fff" />
      <rect y="2.46" width="24" height="1.23" fill="#fff" />
      <rect y="4.92" width="24" height="1.23" fill="#fff" />
      <rect y="7.38" width="24" height="1.23" fill="#fff" />
      <rect y="9.84" width="24" height="1.23" fill="#fff" />
      <rect y="12.3" width="24" height="1.23" fill="#fff" />
      <rect y="14.76" width="24" height="1.23" fill="#fff" />
      <rect width="9.6" height="8.62" fill="#3C3B6E" />
    </svg>
  );
}

export function GlobeIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function LinkIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function BarChartIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

export function UsersGroupIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function DollarSignIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function ClockIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

export function CheckIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

export function XCircleIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export function BanIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

export function MapPinIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function TrendingUpIcon({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  );
}
