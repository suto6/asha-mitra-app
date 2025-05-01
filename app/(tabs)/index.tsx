import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';

export default function HomeScreen() {
  const { userProfile, logout } = useAuth();
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real implementation, we would fetch recent patients
    // For demo purposes, we're using placeholder data
    setRecentPatients([
      {
        id: '1',
        name: 'পিঙ্কি বিশ্বাস',
        age: '25',
        lastVisit: '২০২৩-০৫-১০',
        lmpDate: '২০২৩-০৪-০১',
      },
      {
        id: '2',
        name: 'সুমিতা রায়',
        age: '22',
        lastVisit: '২০২৩-০৫-০৮',
        lmpDate: '২০২৩-০৩-১৫',
      },
    ]);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const result = await logout();
    setLoading(false);

    if (result.success) {
      router.replace('/(auth)/login');
    }
  };

  const navigateToAddPatient = () => {
    router.push('/(tabs)/add-patient');
  };

  const navigateToSearchPatient = () => {
    router.push('/(tabs)/search-patient');
  };

  const navigateToPatientDetails = (patientId) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              {userProfile?.name ? `নমস্কার, ${userProfile.name}` : 'নমস্কার'}
            </Text>
            <Text style={styles.subtitle}>ASHA Mitra</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <Ionicons name="log-out-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionContainer}>
          <BengaliButton
            title={BengaliText.ADD_PATIENT}
            onPress={navigateToAddPatient}
            style={styles.actionButton}
          />
          <BengaliButton
            title={BengaliText.SEARCH_PATIENT}
            onPress={navigateToSearchPatient}
            style={styles.actionButton}
            primary={false}
          />
        </View>

        {/* Recent Patients */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>সাম্প্রতিক পেশেন্ট</Text>

          {recentPatients.length > 0 ? (
            recentPatients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                onPress={() => navigateToPatientDetails(patient.id)}
              >
                <View style={styles.patientIconContainer}>
                  <Ionicons name="person" size={24} color="#4A90E2" />
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientDetails}>
                    {BengaliText.AGE}: {patient.age} | LMP: {patient.lmpDate}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>কোন সাম্প্রতিক পেশেন্ট নেই</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666666',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
  },
});
