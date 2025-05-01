import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import BengaliTextInput from '../../components/BengaliTextInput';
import BengaliButton from '../../components/BengaliButton';
import BengaliText from '../../constants/BengaliText';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // For demo purposes, we'll accept any input
    // Remove validation to make it easier to demo

    setLoading(true);

    try {
      // Simple demo login
      await login(phoneNumber || '1234567890', name || 'Demo User');

      // Navigate to home screen on successful login
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>ASHA Mitra</Text>
          <Text style={styles.appDescription}>
            আশা কর্মীদের জন্য ভয়েস-ভিত্তিক স্বাস্থ্য ডেটা সংগ্রহ অ্যাপ
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>{BengaliText.LOGIN}</Text>

          <BengaliTextInput
            label={BengaliText.PHONE_NUMBER}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={BengaliText.ENTER_PHONE}
            keyboardType="phone-pad"
          />

          <BengaliTextInput
            label="নাম"
            value={name}
            onChangeText={setName}
            placeholder="আপনার নাম লিখুন"
          />

          <BengaliButton
            title="লগইন করুন"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Text style={styles.demoText}>
            এটি একটি ডেমো অ্যাপ। যেকোনো তথ্য দিয়ে লগইন করুন বা সরাসরি লগইন বাটনে ক্লিক করুন।
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButton: {
    marginTop: 16,
  },
  demoText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
