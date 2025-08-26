import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Пытаемся получить пользователя из localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Проверяем наличие пользователя в localStorage
    return !!localStorage.getItem('user');
  });

  const sendOtp = async (phoneNumber) => {
    try {
      // Здесь будет API вызов для отправки OTP
      // Пока что симулируем успешную отправку
      console.log(`OTP sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const login = async (phoneNumber, otp) => {
    try {
      // Здесь будет API вызов для проверки OTP
      // Пока что симулируем успешную авторизацию
      if (otp === '123456') {
        const newUser = {
          id: '1',
          name: 'Ruslanbek Rakhmonov',
          phoneNumber,
          bonusBalance: 12000,
          referralCode: 'REF123'
        };
        setUser(newUser);
        setIsAuthenticated(true);
        // Сохраняем пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Удаляем пользователя из localStorage
    localStorage.removeItem('user');
  };

  const updateProfile = (data) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    sendOtp,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
