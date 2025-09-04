import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

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
      const response = await api.requestOtp(phoneNumber);
      console.log('OTP sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const login = async (phoneNumber, otp) => {
    try {
      const response = await api.verifyOtp(phoneNumber, otp);
      console.log('Login successful:', response);
      
      // Сохраняем токен если он есть
      const token = response.token || response.access_token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      // Получаем полные данные пользователя
      const userProfile = await api.getUserProfile();
      console.log('User profile loaded:', userProfile);
      
      const newUser = {
        id: userProfile.id || response.user_id || '1',
        full_name: userProfile.full_name || response.name || 'User',
        phone_number: userProfile.phone_number || phoneNumber,
        email: userProfile.email || '',
        birth_date: userProfile.birth_date || '',
        balance: userProfile.balance || response.bonus_balance || 12000,
        created_at: userProfile.created_at || new Date().toISOString(),
        updated_at: userProfile.updated_at || new Date().toISOString(),
        token: token
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Удаляем пользователя и токен из localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (data) => {
    if (!user) return false;
    
    try {
      const response = await api.updateUserProfile(data);
      console.log('Profile updated successfully:', response);
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return false;
    
    try {
      const userProfile = await api.getUserProfile();
      console.log('Profile refreshed:', userProfile);
      
      const updatedUser = { ...user, ...userProfile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    sendOtp,
    updateProfile,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
