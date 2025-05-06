import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableNativeFeedback } from 'react-native';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import LanguageToggle from '@/components/LanguageToggle';
import { getPatientDetails, getPatientHealthRecords, deletePatient } from '@/services/patientService';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isEnglish } = useLanguage();

  // Function to fetch patient data
  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching patient details for ID:', id);

      // Fetch patient details
      const patientResult = await getPatientDetails(id);

      if (patientResult.success && patientResult.patient) {
        console.log('Patient details fetched successfully:', patientResult.patient);
        setPatient(patientResult.patient);

        // Fetch health records
        const recordsResult = await getPatientHealthRecords(id);

        if (recordsResult.success) {
          console.log('Health records fetched successfully:', recordsResult.records);
          setHealthRecords(recordsResult.records);
        } else {
          console.error('Failed to fetch health records:', recordsResult.error);
          setHealthRecords([]);
        }
      } else {
        console.error('Failed to fetch patient details:', patientResult.error);
        setError(isEnglish ? 'Failed to load patient data' : 'রোগীর তথ্য লোড করতে ব্যর্থ');

        // Set empty data if fetch fails
        setPatient(null);
        setHealthRecords([]);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError(isEnglish ? 'An error occurred while loading data' : 'তথ্য লোড করার সময় একটি ত্রুটি ঘটেছে');

      // Set empty data if fetch fails
      setPatient(null);
      setHealthRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Patient details screen focused, refreshing data...');
      fetchPatientData();

      // No cleanup needed for this effect
      return () => {};
    }, [id])
  );

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

  // Function to handle patient deletion
  const handleDeletePatient = () => {
    console.log('Delete button pressed for patient ID:', id);

    // Ensure we have a valid patient ID
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid patient ID:', id);
      Alert.alert(
        isEnglish ? 'Error' : BengaliText.ERROR,
        isEnglish ? 'Invalid patient ID' : 'অবৈধ রোগী আইডি'
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      isEnglish ? 'Delete Patient' : BengaliText.DELETE_PATIENT,
      isEnglish
        ? 'Are you sure you want to delete this patient? This action cannot be undone.'
        : BengaliText.DELETE_CONFIRM,
      [
        {
          text: isEnglish ? 'Cancel' : BengaliText.CANCEL,
          style: 'cancel',
          onPress: () => console.log('Delete cancelled')
        },
        {
          text: isEnglish ? 'Delete' : BengaliText.DELETE_PATIENT,
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Delete confirmed for patient ID:', id);
              setLoading(true);

              // Get the patient ID from the patient object if available
              // This ensures we're using the correct ID format
              const patientIdToDelete = patient?.id || id;
              console.log('Using patient ID for deletion:', patientIdToDelete);

              // Call the deletePatient function with the patient ID
              console.log('Calling deletePatient with ID:', patientIdToDelete);
              const result = await deletePatient(patientIdToDelete);
              console.log('Delete result:', result);

              if (result.success) {
                console.log('Patient deleted successfully');
                // Show success message
                Alert.alert(
                  isEnglish ? 'Success' : BengaliText.CONFIRM,
                  isEnglish ? 'Patient deleted successfully' : BengaliText.DELETE_SUCCESS,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('Navigating back after successful deletion');
                        // Navigate back to the previous screen
                        router.back();
                      }
                    }
                  ]
                );
              } else {
                console.error('Failed to delete patient:', result.error);
                // Show error message
                Alert.alert(
                  isEnglish ? 'Error' : BengaliText.ERROR,
                  isEnglish
                    ? `Failed to delete patient: ${result.error}`
                    : `${BengaliText.DELETE_ERROR}: ${result.error}`
                );
                setLoading(false);
              }
            } catch (error) {
              console.error('Error deleting patient:', error);
              Alert.alert(
                isEnglish ? 'Error' : BengaliText.ERROR,
                isEnglish
                  ? 'An error occurred while deleting the patient'
                  : BengaliText.DELETE_ERROR
              );
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>
          {isEnglish ? 'Loading...' : 'লোড হচ্ছে...'}
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <BengaliButton
          title={isEnglish ? 'Try Again' : 'আবার চেষ্টা করুন'}
          onPress={fetchPatientData}
          style={styles.retryButton}
        />
        <BengaliButton
          title={isEnglish ? 'Go Back' : 'ফিরে যান'}
          onPress={() => router.back()}
          style={styles.backButtonLarge}
          textStyle={styles.backButtonText}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button and language toggle */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEnglish ? 'Patient History' : BengaliText.PATIENT_HISTORY}
          </Text>
          <LanguageToggle style={styles.languageToggle} />
        </View>



        {/* Patient Info Card with Delete Button */}
        <View style={styles.patientCardContainer}>
          <View style={styles.patientCard}>
            <View style={styles.patientIconContainer}>
              <Ionicons name="person" size={32} color="#4A90E2" />
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patient?.name}</Text>
              <Text style={styles.patientDetails}>
                {isEnglish ? 'Age' : BengaliText.AGE}: {patient?.age}
              </Text>
            </View>
          </View>

          {/* Delete Button */}
          {Platform.OS === 'android' ? (
            <View style={styles.deleteIconButtonContainer}>
              <TouchableNativeFeedback
                onPress={handleDeletePatient}
                background={TouchableNativeFeedback.Ripple('#FFE5E5', true)}
                accessibilityLabel={isEnglish ? "Delete Patient" : BengaliText.DELETE_PATIENT}
                accessibilityHint={isEnglish ? "Deletes this patient record" : "এই রোগীর রেকর্ড মুছে ফেলে"}
              >
                <View style={styles.deleteIconButton}>
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </View>
              </TouchableNativeFeedback>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.deleteIconButton, styles.deleteIconButtonIOS]}
              onPress={handleDeletePatient}
              activeOpacity={0.6}
              accessibilityLabel={isEnglish ? "Delete Patient" : BengaliText.DELETE_PATIENT}
              accessibilityHint={isEnglish ? "Deletes this patient record" : "এই রোগীর রেকর্ড মুছে ফেলে"}
            >
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>

        {/* Add Health Record Button */}
        <BengaliButton
          title={isEnglish ? "Add New Health Record" : "নতুন স্বাস্থ্য রেকর্ড যোগ করুন"}
          onPress={handleAddHealthRecord}
          style={styles.addRecordButton}
        />

        {/* Health Records */}
        <View style={styles.recordsContainer}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? "Health Records" : "স্বাস্থ্য রেকর্ড"}
          </Text>

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
                    <Text style={styles.recordLabel}>
                      {isEnglish ? "LMP Date" : BengaliText.LMP_DATE}
                    </Text>
                    <Text style={styles.recordValue}>{record.lmp_date}</Text>
                  </View>

                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>
                      {isEnglish ? "Weight" : BengaliText.WEIGHT}
                    </Text>
                    <Text style={styles.recordValue}>
                      {record.weight_kg} {isEnglish ? "kg" : "কেজি"}
                    </Text>
                  </View>

                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>
                      {isEnglish ? "Height" : BengaliText.HEIGHT}
                    </Text>
                    <Text style={styles.recordValue}>
                      {record.height_cm} {isEnglish ? "cm" : "সেমি"}
                    </Text>
                  </View>

                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>
                      {isEnglish ? "Blood Pressure" : BengaliText.BLOOD_PRESSURE}
                    </Text>
                    <Text style={styles.recordValue}>{record.blood_pressure}</Text>
                  </View>

                  {record.notes ? (
                    <View style={styles.recordNotes}>
                      <Text style={styles.recordLabel}>
                        {isEnglish ? "Notes" : BengaliText.NOTES}
                      </Text>
                      <Text style={styles.recordValue}>{record.notes}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {isEnglish ? "No health records found" : "কোন স্বাস্থ্য রেকর্ড নেই"}
            </Text>
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
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    marginBottom: 12,
    backgroundColor: '#4A90E2',
  },
  backButtonLarge: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  backButtonText: {
    color: '#4A90E2',
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
  languageToggle: {
    padding: 8,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    paddingRight: 50, // Add extra padding on the right for the delete button
    width: '100%',
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
  patientCardContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  deleteIconButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden', // Important for TouchableNativeFeedback
  },
  deleteIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  deleteIconButtonIOS: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addRecordButton: {
    backgroundColor: '#4A90E2',
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
