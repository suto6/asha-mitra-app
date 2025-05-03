import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import { getPatientDetails, getPatientHealthRecords } from '@/services/patientService';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would fetch patient details and health records
    // For demo purposes, we're using simulated data

    // Simulate API call
    setTimeout(() => {
      // Simulated patient data
      const simulatedPatient = {
        id: id,
        name: 'পিঙ্কি বিশ্বাস',
        age: '25',
      };

      // Simulated health records
      const simulatedRecords = [
        {
          id: '1',
          lmp_date: '২০২৩-০৪-০১',
          weight_kg: '৫৫',
          height_cm: '১৫৭',
          blood_pressure: '১২০/৮০',
          notes: 'বিশেষ কোনো সমস্যা নেই।',
          timestamp: new Date('2023-05-10').toISOString(),
        },
        {
          id: '2',
          lmp_date: '২০২৩-০৩-০১',
          weight_kg: '৫৪',
          height_cm: '১৫৭',
          blood_pressure: '১১৮/৭৮',
          notes: 'সামান্য বমি বমি ভাব।',
          timestamp: new Date('2023-04-05').toISOString(),
        },
      ];

      setPatient(simulatedPatient);
      setHealthRecords(simulatedRecords);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('bn-IN');
    } catch (error) {
      return dateString;
    }
  };

  // Function to add new health record
  const handleAddHealthRecord = () => {
    router.push({
      pathname: '/patient/add-record',
      params: { patientId: id }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.title}>{BengaliText.PATIENT_HISTORY}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientIconContainer}>
            <Ionicons name="person" size={32} color="#4A90E2" />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient?.name}</Text>
            <Text style={styles.patientDetails}>
              {BengaliText.AGE}: {patient?.age}
            </Text>
          </View>
        </View>

        {/* Add Health Record Button */}
        <BengaliButton
          title="নতুন স্বাস্থ্য রেকর্ড যোগ করুন"
          onPress={handleAddHealthRecord}
          style={styles.addRecordButton}
        />

        {/* Health Records */}
        <View style={styles.recordsContainer}>
          <Text style={styles.sectionTitle}>স্বাস্থ্য রেকর্ড</Text>

          {healthRecords.length > 0 ? (
            healthRecords.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>
                    {formatDate(record.timestamp)}
                  </Text>
                </View>

                <View style={styles.recordDetails}>
                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>{BengaliText.LMP_DATE}</Text>
                    <Text style={styles.recordValue}>{record.lmp_date}</Text>
                  </View>

                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>{BengaliText.WEIGHT}</Text>
                    <Text style={styles.recordValue}>{record.weight_kg} কেজি</Text>
                  </View>

                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>{BengaliText.HEIGHT}</Text>
                    <Text style={styles.recordValue}>{record.height_cm} সেমি</Text>
                  </View>

                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>{BengaliText.BLOOD_PRESSURE}</Text>
                    <Text style={styles.recordValue}>{record.blood_pressure}</Text>
                  </View>

                  {record.notes ? (
                    <View style={styles.recordNotes}>
                      <Text style={styles.recordLabel}>{BengaliText.NOTES}</Text>
                      <Text style={styles.recordValue}>{record.notes}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>কোন স্বাস্থ্য রেকর্ড নেই</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 16,
    color: '#666666',
  },
  addRecordButton: {
    marginBottom: 20,
  },
  recordsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  recordHeader: {
    backgroundColor: '#4A90E2',
    padding: 12,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recordDetails: {
    padding: 16,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  recordNotes: {
    paddingVertical: 8,
    marginTop: 8,
  },
  recordLabel: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  recordValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
  },
});
