import React, { useState } from 'react';
import { AvatarIcon } from './Main/icons';

const UserAvatar = ({
  avatarUrl,
  size = 'w-12 h-12',
  className = '',
  showBorder = false,
  iconSize = 'w-8 h-8', // Новый параметр для размера иконки
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const shouldShowPlaceholder = !avatarUrl || imageError;

  return (
    <div
      className={`${size} rounded-full overflow-hidden relative group ${className}`}
      {...props}
    >
      {shouldShowPlaceholder ? (
        <div className="w-full h-full flex items-center justify-center transition-all duration-200 group-hover:from-purple-500 group-hover:via-blue-600 group-hover:to-indigo-700">
          <AvatarIcon className={`text-white stroke-[1.5] ${iconSize}`} />
        </div>
      ) : (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      )}
      
      {showBorder && (
        <div className="absolute inset-0 rounded-full ring-2 ring-white/30 ring-offset-1" />
      )}
    </div>
  );
};

export default UserAvatar;