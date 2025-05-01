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
        {/* Header with Profile */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userProfile?.name ? userProfile.name.charAt(0) : 'অ'}
                </Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>
                  {userProfile?.name ? `${BengaliText.WELCOME}, ${userProfile.name}` : BengaliText.WELCOME}
                </Text>
                <Text style={styles.subtitle}>ASHA Mitra</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loading}
            >
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Action Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{BengaliText.QUICK_ACTIONS}</Text>

          <View style={styles.actionCardsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={navigateToAddPatient}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#4CD964' }]}>
                <Ionicons name="person-add" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionCardTitle}>{BengaliText.ADD_PATIENT}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={navigateToSearchPatient}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#4A90E2' }]}>
                <Ionicons name="search" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionCardTitle}>{BengaliText.SEARCH_PATIENT}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Patients Section */}
        <View style={styles.recentPatientsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{BengaliText.RECENT_PATIENTS}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={navigateToSearchPatient}
            >
              <Text style={styles.viewAllText}>{BengaliText.SEARCH_PATIENT}</Text>
              <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          {recentPatients.length > 0 ? (
            <View style={styles.patientCardsContainer}>
              {recentPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.patientCard}
                  onPress={() => navigateToPatientDetails(patient.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.patientIconContainer}>
                    <Ionicons name="person" size={24} color="#4A90E2" />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>
                      {BengaliText.AGE}: {patient.age} | {BengaliText.LMP_DATE}: {patient.lmpDate}
                    </Text>
                  </View>
                  <View style={styles.patientCardAction}>
                    <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="people" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>{BengaliText.NO_RECENT_PATIENTS}</Text>
            </View>
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
    paddingBottom: 30,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#4A90E2',
    paddingTop: 60,
    paddingBottom: 30,
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Quick Actions Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },

  // Recent Patients Styles
  recentPatientsSection: {
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 4,
  },
  patientCardsContainer: {
    marginBottom: 20,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
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
  patientCardAction: {
    padding: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
});
