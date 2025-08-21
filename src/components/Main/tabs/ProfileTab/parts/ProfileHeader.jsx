import React from 'react';

const ProfileHeader = ({ title, subtitle }) => {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

      <div className="relative">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner border border-white/30 hover:scale-105 transition-transform duration-300">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-sm">{title}</h3>
        <p className="text-white/90 font-medium bg-white/10 rounded-full px-4 py-1 inline-block backdrop-blur-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
