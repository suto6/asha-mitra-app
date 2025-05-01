import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function HomeScreen() {
  const { isEnglish } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('@/assets/images/health-bg.jpg')} 
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(245,247,250,1)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.languageToggleContainer}>
            <LanguageToggle />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="medkit" size={80} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.appTitle}>
              {isEnglish ? 'ASHA Mitra App' : 'আশা মিত্র অ্যাপ'}
            </Text>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {isEnglish
                  ? 'A comprehensive health management application for ASHA workers to track maternal and child health.'
                  : 'আশা কর্মীদের জন্য একটি সম্পূর্ণ স্বাস্থ্য ব্যবস্থাপনা অ্যাপ্লিকেশন যা মাতৃ ও শিশু স্বাস্থ্য ট্র্যাক করতে সাহায্য করে।'}
              </Text>

              <Text style={styles.featureText}>
                {isEnglish ? 'Key Features' : 'প্রধান বৈশিষ্ট্য'}:
              </Text>

              <View style={styles.featureList}>
                <View style={[styles.featureItem, styles.featureItem1]}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="woman" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureItemText}>
                    {isEnglish ? 'Maternal Health Tracking' : 'মাতৃ স্বাস্থ্য ট্র্যাকিং'}
                  </Text>
                </View>

                <View style={[styles.featureItem, styles.featureItem2]}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="body" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureItemText}>
                    {isEnglish ? 'Child Health Monitoring' : 'শিশু স্বাস্থ্য পর্যবেক্ষণ'}
                  </Text>
                </View>

                <View style={[styles.featureItem, styles.featureItem3]}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="calendar" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureItemText}>
                    {isEnglish ? 'Appointment Scheduling' : 'অ্যাপয়েন্টমেন্ট শিডিউলিং'}
                  </Text>
                </View>

                <View style={[styles.featureItem, styles.featureItem4]}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureItemText}>
                    {isEnglish ? 'Health Statistics' : 'স্বাস্থ্য পরিসংখ্যান'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <LinearGradient
                colors={['#4A90E2', '#89CFF0']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>
                  {isEnglish ? 'Login' : 'লগইন করুন'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    flex: 1,
  },
  languageToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Roboto', // Consider using a custom font
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 40,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'Roboto',
  },
  featureText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  featureList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 6,
  },
  featureItem1: {
    borderLeftColor: '#4A90E2',
  },
  featureItem2: {
    borderLeftColor: '#5CB85C',
  },
  featureItem3: {
    borderLeftColor: '#F0AD4E',
  },
  featureItem4: {
    borderLeftColor: '#5BC0DE',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureItemText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  loginButton: {
    width: '80%',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});