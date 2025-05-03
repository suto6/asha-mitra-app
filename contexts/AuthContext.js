import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeAsyncStorage } from '../lib/asyncStorage';

// Use the appropriate storage based on platform
const storage = Platform.OS === 'web' ? safeAsyncStorage : AsyncStorage;

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginStatus = await storage.getItem('isLoggedIn');
        const storedProfile = await storage.getItem('userProfile');

        if (loginStatus === 'true') {
          setIsAuthenticated(true);
          if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
          } else {
            // Default demo profile
            const demoProfile = {
              name: 'সুমিতা রায়',
              role: 'ASHA Kormi',
              district: 'West Bengal'
            };
            setUserProfile(demoProfile);
            await storage.setItem('userProfile', JSON.stringify(demoProfile));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking login status:', error);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login function
  const login = async (phoneNumber, name) => {
    try {
      // Create a demo user profile
      const demoProfile = {
        name: name || 'সুমিতা রায়',
        phone: phoneNumber,
        role: 'ASHA Kormi',
        district: 'West Bengal'
      };

      // Save login status and profile to storage
      await storage.setItem('isLoggedIn', 'true');
      await storage.setItem('userProfile', JSON.stringify(demoProfile));

      setUserProfile(demoProfile);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear login status and profile from storage
      await storage.removeItem('isLoggedIn');
      await storage.removeItem('userProfile');

      setUserProfile(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  };

  // Value to be provided by the context
  const value = {
    userProfile,
    setUserProfile,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
