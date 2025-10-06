import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setInitializing } from '../services/api';
import trackingService from '../services/trackingService';

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
  const [profileCache, setProfileCache] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

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

  const sendOtp = async (phoneNumber, referralCode = null, language = 'ru', source = 'telegram') => {
    try {
      trackingService.track('auth_otp_request', {
        phone_number: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : null,
        has_referral_code: !!referralCode,
        language: language,
        source: source
      });
      
      const response = await api.requestOtp(phoneNumber, referralCode, language, source);
      
      trackingService.track('auth_otp_request_success', {
        phone_number: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : null,
        language: language,
        source: source
      });
      
      return true;
    } catch (error) {
      trackingService.track('auth_otp_request_error', {
        phone_number: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : null,
        error_message: error.message,
        language: language,
        source: source
      });
      
      return false;
    }
  };

  const login = async (phoneNumber, otp) => {
    try {
      trackingService.track('auth_login_attempt', {
        phone_number: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : null
      });
      
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
      
      trackingService.track('auth_login_success', {
        user_id: newUser.id,
        phone_number: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : null,
        has_balance: !!newUser.balance
      });
      
      return true;
    } catch (error) {
      trackingService.track('auth_login_error', {
        phone_number: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : null,
        error_message: error.message
      });
      
      return false;
    }
  };

  const logout = () => {
    trackingService.track('auth_logout', {
      user_id: user?.id
    });
    
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
      trackingService.track('profile_update_attempt', {
        user_id: user.id,
        fields_updated: Object.keys(data)
      });
      
      const response = await api.updateUserProfile(data);
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      trackingService.track('profile_update_success', {
        user_id: user.id,
        fields_updated: Object.keys(data)
      });
      
      return true;
    } catch (error) {
      trackingService.track('profile_update_error', {
        user_id: user.id,
        fields_updated: Object.keys(data),
        error_message: error.message
      });
      
      return false;
    }
  };

  const refreshUserProfile = async (forceRefresh = false) => {
    if (!user || isLoadingProfile) return false;
    
    const now = Date.now();
    const cacheAge = cacheTimestamp ? now - cacheTimestamp : Infinity;
    const cacheValid = cacheAge < 30000;
    
    if (!forceRefresh && cacheValid && profileCache) {
      const updatedUser = { ...user, ...profileCache };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    }
    
    setIsLoadingProfile(true);
    try {
      const userProfile = await api.getUserProfile();
      
      setProfileCache(userProfile);
      setCacheTimestamp(now);
      
      const updatedUser = { ...user, ...userProfile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
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
