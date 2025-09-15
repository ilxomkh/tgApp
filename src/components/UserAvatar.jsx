import React, { useState } from 'react';
import placeholderAvatar from '../assets/Ellipse 4.png';

const UserAvatar = ({ 
  avatarUrl, 
  size = 'w-12 h-12', 
  className = '', 
  showBorder = true,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const shouldShowPlaceholder = !avatarUrl || imageError;
  
  return (
    <div 
      className={`${size} rounded-full overflow-hidden flex items-center justify-center ${className}`}
      {...props}
    >
      {shouldShowPlaceholder ? (
        <img
          src={placeholderAvatar}
          alt="User Avatar"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      
      {showBorder && (
        <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none" />
      )}
    </div>
  );
};

export default UserAvatar;
