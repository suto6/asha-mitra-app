import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import VoiceInputButton from '@/components/VoiceInputButton';
import AlertBox from '@/components/AlertBox';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { startVoiceRecognition, parsePatientData, speakBengali } from '@/utils/voiceRecognition';
import { analyzeHealthData, processHealthAlerts } from '@/utils/healthAnalysis';
import { getPatientDetails, addHealthRecord } from '@/services/patientService';

export default function AddHealthRecordScreen() {
  const { patientId } = useLocalSearchParams();
  const { currentUser } = useAuth();
  const { isEnglish } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [healthData, setHealthData] = useState({
    lmpDate: '',
    weight: '',
    height: '',
    bloodPressure: '',
    notes: '',
  });
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patient details
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching patient details for ID:', patientId);
        const result = await getPatientDetails(patientId);

        if (result.success && result.patient) {
          console.log('Patient details fetched successfully:', result.patient);
          setPatient(result.patient);
        } else {
          console.error('Failed to fetch patient details:', result.error);
          setError(isEnglish ? 'Failed to load patient data' : 'রোগীর তথ্য লোড করতে ব্যর্থ');
        }
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(isEnglish ? 'An error occurred while loading data' : 'তথ্য লোড করার সময় একটি ত্রুটি ঘটেছে');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, isEnglish]);

  // Function to handle starting voice recording
  const handleStartRecording = async () => {
    setIsRecording(true);

    try {
      // Speak prompt in the appropriate language
      await speakBengali(isEnglish ? "Please speak now" : BengaliText.SPEAK_NOW);

      // Start actual voice recognition
      const recognition = await startVoiceRecognition(
        (result) => {
          // Handle successful voice recognition
          console.log('Voice recognition result:', result);
          setIsRecording(false);
          setIsProcessing(true);

          // Parse the voice input
          const parsedData = parsePatientData(result);
          console.log('Parsed voice input:', parsedData);

          // Update health data with parsed values
          setHealthData({
            lmpDate: parsedData.lmpDate || healthData.lmpDate,
            weight: parsedData.weight || healthData.weight,
            height: parsedData.height || healthData.height,
            bloodPressure: parsedData.bloodPressure || healthData.bloodPressure,
            notes: parsedData.notes || healthData.notes,
          });

          // Process the result
          setTimeout(() => {
            setIsProcessing(false);

            // Analyze health data for potential risks
            const alerts = analyzeHealthData(parsedData);
            setHealthAlerts(alerts);

            // Process alerts (speak warnings)
            if (alerts && alerts.length > 0) {
              processHealthAlerts(alerts);
            }
          }, 500);
        },
        (error) => {
          // Handle error
          console.error('Voice recognition error:', error);
          setIsRecording(false);
          setIsProcessing(false);

          // Show error message
          Alert.alert(
            isEnglish ? 'Error' : 'ত্রুটি',
            isEnglish ? 'Failed to recognize speech. Please try again.' : 'কথা চিনতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            [{ text: isEnglish ? 'OK' : 'ঠিক আছে' }]
          );
        }
      );
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setIsRecording(false);
    }
  };

  // Function to handle stopping voice recording
  const handleStopRecording = async () => {
    setIsRecording(false);
  };

  // Function to save health record
  const handleSaveRecord = async () => {
    if (!healthData.lmpDate && !healthData.weight && !healthData.bloodPressure) {
      Alert.alert(
        isEnglish ? 'Error' : BengaliText.ERROR,
        isEnglish ? 'Please provide at least one health data field' : 'অন্তত একটি স্বাস্থ্য তথ্য দিন'
      );
      return;
    }

    setSaving(true);

    try {
      // Save the health record to the database
      const result = await addHealthRecord(patientId, {
        lmpDate: healthData.lmpDate,
        weight: healthData.weight,
        height: healthData.height,
        bloodPressure: healthData.bloodPressure,
        notes: healthData.notes
      });

      if (result.success) {
        Alert.alert(
          isEnglish ? 'Success' : BengaliText.DATA_SAVED,
          isEnglish ? 'Health record saved successfully' : 'স্বাস্থ্য রেকর্ড সফলভাবে সংরক্ষিত হয়েছে',
          [
            {
              text: isEnglish ? 'OK' : BengaliText.CONFIRM,
              onPress: () => {
                // Navigate back to patient details
                router.back();
              }
            }
          ]
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Alert.alert(
        isEnglish ? 'Error' : BengaliText.ERROR,
        isEnglish ? `Failed to save record: ${error.message}` : `রেকর্ড সংরক্ষণ করতে ব্যর্থ: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // Function to dismiss health alerts
  const handleDismissAlert = (index) => {
    const updatedAlerts = [...healthAlerts];
    updatedAlerts.splice(index, 1);
    setHealthAlerts(updatedAlerts);
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
          title={isEnglish ? 'Go Back' : 'ফিরে যান'}
          onPress={() => router.back()}
          style={styles.backButtonLarge}
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
            {isEnglish ? 'New Health Record' : 'নতুন স্বাস্থ্য রেকর্ড'}
          </Text>
          <LanguageToggle style={styles.languageToggle} />
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientName}>{patient?.name}</Text>
          <Text style={styles.patientDetails}>
            {isEnglish ? 'Age' : BengaliText.AGE}: {patient?.age}
          </Text>
        </View>

        {/* Voice Input Button */}
        <View style={styles.voiceInputContainer}>
          <Text style={styles.voiceInputLabel}>
            {isEnglish ? 'Provide health information using voice' : 'স্বাস্থ্য তথ্য ভয়েস দিয়ে দিন'}
          </Text>
          <VoiceInputButton
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            isRecording={isRecording}
            isProcessing={isProcessing}
          />
        </View>

        {/* Health Alerts */}
        <AlertBox
          alerts={healthAlerts}
          onDismiss={handleDismissAlert}
        />

        {/* Health Record Form */}
        <View style={styles.formContainer}>
          <BengaliTextInput
            label={isEnglish ? "LMP Date" : BengaliText.LMP_DATE}
            value={healthData.lmpDate}
            onChangeText={(text) => setHealthData({...healthData, lmpDate: text})}
            placeholder={isEnglish ? "Enter LMP date" : BengaliText.LMP_DATE}
          />

          <BengaliTextInput
            label={isEnglish ? "Weight" : BengaliText.WEIGHT}
            value={healthData.weight}
            onChangeText={(text) => setHealthData({...healthData, weight: text})}
            placeholder={isEnglish ? "Enter weight" : BengaliText.WEIGHT}
            keyboardType="numeric"
          />

          <BengaliTextInput
            label={isEnglish ? "Height" : BengaliText.HEIGHT}
            value={healthData.height}
            onChangeText={(text) => setHealthData({...healthData, height: text})}
            placeholder={isEnglish ? "Enter height" : BengaliText.HEIGHT}
          />

          <BengaliTextInput
            label={isEnglish ? "Blood Pressure" : BengaliText.BLOOD_PRESSURE}
            value={healthData.bloodPressure}
            onChangeText={(text) => setHealthData({...healthData, bloodPressure: text})}
            placeholder={isEnglish ? "Enter blood pressure" : BengaliText.BLOOD_PRESSURE}
          />

          <BengaliTextInput
            label={isEnglish ? "Notes" : BengaliText.NOTES}
            value={healthData.notes}
            onChangeText={(text) => setHealthData({...healthData, notes: text})}
            placeholder={isEnglish ? "Enter notes" : BengaliText.NOTES}
            multiline={true}
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <BengaliButton
              title={isEnglish ? "Save" : BengaliText.SAVE}
              onPress={handleSaveRecord}
              loading={saving}
            />

            <BengaliButton
              title={isEnglish ? "Cancel" : BengaliText.CANCEL}
              onPress={() => router.back()}
              primary={false}
              disabled={saving}
            />
          </View>
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
  backButtonLarge: {
    backgroundColor: '#4A90E2',
    marginTop: 12,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 16,
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
  patientInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 16,
    color: '#666666',
  },
  voiceInputContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceInputLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
