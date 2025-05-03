import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import BengaliTextInput from '@/components/BengaliTextInput';
import BengaliButton from '@/components/BengaliButton';
import LanguageToggle from '@/components/LanguageToggle';
import BottomNavBar from '@/components/BottomNavBar';


export default function ProfileScreen() {
  const { userProfile, logout } = useAuth();
  const { isEnglish } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || 'ASHA Mitra User',
    role: userProfile?.role || 'আশা কর্মী',
    phone: userProfile?.phone || '9876543210',
    district: userProfile?.district || 'কলকাতা',
    center: userProfile?.center || 'সেন্টার ১',
  });

  const handleSaveProfile = () => {
    // In a real app, this would save the profile data to the server
    setEditing(false);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>প্রোফাইল</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(!editing)}
            >
              <Ionicons name={editing ? "close" : "create-outline"} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.name ? profileData.name.charAt(0) : 'অ'}
            </Text>
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileRole}>{profileData.role}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {editing ? (
            <View style={styles.editForm}>
              <BengaliTextInput
                label="নাম"
                value={profileData.name}
                onChangeText={(text) => setProfileData({...profileData, name: text})}
              />

              <BengaliTextInput
                label="ফোন নম্বর"
                value={profileData.phone}
                onChangeText={(text) => setProfileData({...profileData, phone: text})}
                keyboardType="phone-pad"
              />

              <BengaliTextInput
                label="জেলা"
                value={profileData.district}
                onChangeText={(text) => setProfileData({...profileData, district: text})}
              />

              <BengaliTextInput
                label="কেন্দ্র"
                value={profileData.center}
                onChangeText={(text) => setProfileData({...profileData, center: text})}
              />

              <View style={styles.buttonContainer}>
                <BengaliButton
                  title="সংরক্ষণ করুন"
                  onPress={handleSaveProfile}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.detailItem}>
                <Ionicons name="call-outline" size={24} color="#4A90E2" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>ফোন নম্বর</Text>
                  <Text style={styles.detailValue}>{profileData.phone}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={24} color="#4A90E2" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>জেলা</Text>
                  <Text style={styles.detailValue}>{profileData.district}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="business-outline" size={24} color="#4A90E2" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>কেন্দ্র</Text>
                  <Text style={styles.detailValue}>{profileData.center}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>{BengaliText.LOGOUT}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#5856D6',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Avatar Styles
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#666666',
  },

  // Details Styles
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailContent: {
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },

  // Edit Form Styles
  editForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 20,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginLeft: 8,
  },
});
