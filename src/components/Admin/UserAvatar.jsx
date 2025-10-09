import React, { useState } from 'react';
import { getUserInitials } from '../../utils/adminUtils.jsx';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '',
  showBorder = false 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  const avatarUrl = user?.avatar_url || user?.avatar || user?.profile_picture || user?.image_url;
  
  if (avatarUrl) {
  } else {}
  
  const initials = getUserInitials(user?.full_name);
  
  return (
    <div 
      className={`
        ${sizeClass} 
        ${showBorder ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-100' : ''}
        ${className}
      `}
    >
      {avatarUrl && !imageError ? (
        <img
          src={avatarUrl}
          alt={user?.full_name || 'User'}
          className="w-full h-full rounded-full object-cover"
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#5538F9] to-[#7C65FF] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
