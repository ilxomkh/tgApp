import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setInitializing } from '../services/api';

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
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('user');
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        setIsInitializing(false);
        setInitializing(false);
        return;
      }
      
      setInitializing(true);
      
      try {
        const userProfile = await api.getUserProfile();
        
        const updatedUser = { ...JSON.parse(savedUser), ...userProfile };
        setUser(updatedUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
      } catch (error) {
        console.error('Token validation failed:', error);
        
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('session_id');
      } finally {
        setIsInitializing(false);
        setInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  const sendOtp = async (phoneNumber) => {
    try {
      const response = await api.requestOtp(phoneNumber);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const login = async (phoneNumber, otp) => {
    try {
      const response = await api.verifyOtp(phoneNumber, otp);
      
      const sessionId = response.session_id;
      if (sessionId) {
        localStorage.setItem('session_id', sessionId);
      }
      
      const token = response.token || response.access_token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      
      const userProfile = await api.getUserProfile();
      
      const newUser = {
        id: userProfile.id || response.user_id || '1',
        full_name: userProfile.full_name || response.name || 'User',
        phone_number: userProfile.phone_number || phoneNumber,
        email: userProfile.email || '',
        birth_date: userProfile.birth_date || '',
        avatar_url: userProfile.avatar_url || '',
        balance: userProfile.balance || response.bonus_balance || 12000,
        created_at: userProfile.created_at || new Date().toISOString(),
        updated_at: userProfile.updated_at || new Date().toISOString(),
        token: token
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
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
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_id');
    
    window.location.href = '/';
  };

  const resetToOnboarding = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_id');
    
    window.location.href = '/onboarding';
  };

  const updateProfile = async (data) => {
    if (!user) return false;
    
    try {
      const response = await api.updateUserProfile(data);
      
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
    if (!user || isLoadingProfile) return false;
    
    setIsLoadingProfile(true);
    try {
      const userProfile = await api.getUserProfile();
      
      const updatedUser = { ...user, ...userProfile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      
      return false;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoadingProfile,
    isInitializing,
    login,
    logout,
    resetToOnboarding,
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
