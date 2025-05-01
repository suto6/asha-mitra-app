import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import VoiceInputButton from '@/components/VoiceInputButton';
import AlertBox from '@/components/AlertBox';
import { useAuth } from '@/contexts/AuthContext';
import { startVoiceRecognition, parsePatientData, speakBengali } from '@/utils/voiceRecognition';
import { analyzeHealthData, processHealthAlerts } from '@/utils/healthAnalysis';
import { addPatient } from '@/services/firebaseService';

export default function AddPatientScreen() {
  const { currentUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    lmpDate: '',
    weight: '',
    height: '',
    bloodPressure: '',
    notes: '',
  });
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [saving, setSaving] = useState(false);

  // Function to handle starting voice recording
  const handleStartRecording = async () => {
    setIsRecording(true);

    // In a real implementation, we would start actual voice recognition here
    // For demo purposes, we're simulating voice recognition

    // Simulate voice recognition with Bengali text
    // This would be replaced with actual Bengali speech recognition in production
    speakBengali(BengaliText.SPEAK_NOW);
  };

  // Function to handle stopping voice recording
  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      // Simulate voice recognition result
      const simulatedVoiceInput =
        "পেশেন্টের নাম পিঙ্কি বিশ্বাস, বয়স ২৫ বছর, শেষ মাসিকের তারিখ ২০২৩-০৪-০১, " +
        "ওজন ৫৫ কেজি, উচ্চতা ৫ ফুট ২ ইঞ্চি, ব্লাড প্রেসার ১২০/৮০, বিশেষ কোনো সমস্যা নেই।";

      // Parse the voice input
      const parsedData = {
        name: 'পিঙ্কি বিশ্বাস',
        age: '২৫',
        lmpDate: '২০২৩-০৪-০১',
        weight: '৫৫',
        height: '৫ ফুট ২ ইঞ্চি',
        bloodPressure: '১২০/৮০',
        notes: 'বিশেষ কোনো সমস্যা নেই।',
      };

      setPatientData(parsedData);
      setIsProcessing(false);

      // Analyze health data for potential risks
      const alerts = analyzeHealthData(parsedData);
      setHealthAlerts(alerts);

      // Process alerts (speak warnings)
      if (alerts && alerts.length > 0) {
        processHealthAlerts(alerts);
      }
    }, 2000);
  };

  // Function to save patient data
  const handleSavePatient = async () => {
    if (!patientData.name || !patientData.age) {
      Alert.alert(BengaliText.ERROR, BengaliText.REQUIRED_FIELD);
      return;
    }

    setSaving(true);

    try {
      const result = await addPatient(patientData, currentUser.uid);

      if (result.success) {
        Alert.alert(BengaliText.DATA_SAVED, '', [
          {
            text: BengaliText.CONFIRM,
            onPress: () => {
              // Reset form and navigate back to home
              setPatientData({
                name: '',
                age: '',
                lmpDate: '',
                weight: '',
                height: '',
                bloodPressure: '',
                notes: '',
              });
              setHealthAlerts([]);
              router.push('/(tabs)');
            }
          }
        ]);
      } else {
        Alert.alert(BengaliText.ERROR, BengaliText.TRY_AGAIN);
      }
    } catch (error) {
      Alert.alert(BengaliText.ERROR, error.message);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>{BengaliText.ADD_PATIENT}</Text>
            <View style={styles.placeholderView} />
          </View>
        </View>

        {/* Voice Input Section */}
        <View style={styles.voiceSection}>
          <Text style={styles.voiceTitle}>{BengaliText.SPEAK_NOW}</Text>
          <Text style={styles.voiceSubtitle}>
            পেশেন্টের তথ্য ভয়েস দিয়ে দিন
          </Text>

          <View style={styles.voiceInputContainer}>
            <VoiceInputButton
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              isRecording={isRecording}
              isProcessing={isProcessing}
            />
          </View>
        </View>

        {/* Health Alerts */}
        <View style={styles.alertsContainer}>
          <AlertBox
            alerts={healthAlerts}
            onDismiss={handleDismissAlert}
          />
        </View>

        {/* Patient Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>পেশেন্টের তথ্য</Text>

          <View style={styles.formFields}>
            <BengaliTextInput
              label={BengaliText.PATIENT_NAME}
              value={patientData.name}
              onChangeText={(text) => setPatientData({...patientData, name: text})}
              placeholder={BengaliText.PATIENT_NAME}
            />

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <BengaliTextInput
                  label={BengaliText.AGE}
                  value={patientData.age}
                  onChangeText={(text) => setPatientData({...patientData, age: text})}
                  placeholder={BengaliText.AGE}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <BengaliTextInput
                  label={BengaliText.LMP_DATE}
                  value={patientData.lmpDate}
                  onChangeText={(text) => setPatientData({...patientData, lmpDate: text})}
                  placeholder={BengaliText.LMP_DATE}
                />
              </View>
            </View>

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <BengaliTextInput
                  label={BengaliText.WEIGHT}
                  value={patientData.weight}
                  onChangeText={(text) => setPatientData({...patientData, weight: text})}
                  placeholder={BengaliText.WEIGHT}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <BengaliTextInput
                  label={BengaliText.HEIGHT}
                  value={patientData.height}
                  onChangeText={(text) => setPatientData({...patientData, height: text})}
                  placeholder={BengaliText.HEIGHT}
                />
              </View>
            </View>

            <BengaliTextInput
              label={BengaliText.BLOOD_PRESSURE}
              value={patientData.bloodPressure}
              onChangeText={(text) => setPatientData({...patientData, bloodPressure: text})}
              placeholder={BengaliText.BLOOD_PRESSURE}
            />

            <BengaliTextInput
              label={BengaliText.NOTES}
              value={patientData.notes}
              onChangeText={(text) => setPatientData({...patientData, notes: text})}
              placeholder={BengaliText.NOTES}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonContainer}>
            <BengaliButton
              title={BengaliText.SAVE}
              onPress={handleSavePatient}
              loading={saving}
              disabled={!patientData.name || !patientData.age}
            />

            <BengaliButton
              title={BengaliText.CANCEL}
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
  scrollContent: {
    paddingBottom: 30,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#4A90E2',
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
  placeholderView: {
    width: 40,
  },

  // Voice Input Section
  voiceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  voiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  voiceSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  voiceInputContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },

  // Alerts Container
  alertsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Form Styles
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  formFields: {
    marginBottom: 10,
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
