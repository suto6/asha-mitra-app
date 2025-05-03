import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeAsyncStorage } from '../lib/asyncStorage';

// Use the appropriate storage based on platform
const storage = Platform.OS === 'web' ? safeAsyncStorage : AsyncStorage;

// Create the language context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component that wraps the app and provides language context
export const LanguageProvider = ({ children }) => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if language preference is already set
  useEffect(() => {
    const checkLanguagePreference = async () => {
      try {
        const languagePreference = await storage.getItem('isEnglish');
        if (languagePreference === 'true') {
          setIsEnglish(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking language preference:', error);
        setLoading(false);
      }
    };

    checkLanguagePreference();
  }, []);

  // Toggle language function
  const toggleLanguage = async () => {
    try {
      const newValue = !isEnglish;
      await storage.setItem('isEnglish', newValue.toString());
      setIsEnglish(newValue);
      return { success: true };
    } catch (error) {
      console.error('Error toggling language:', error);
      return { success: false, error: error.message };
    }
  };

  // Value to be provided by the context
  const value = {
    isEnglish,
    toggleLanguage,
    loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {!loading && children}
    </LanguageContext.Provider>
  );
};
