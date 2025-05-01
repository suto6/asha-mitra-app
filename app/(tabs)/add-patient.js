import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{BengaliText.ADD_PATIENT}</Text>
          <Text style={styles.subtitle}>
            {BengaliText.SPEAK_NOW}
          </Text>
        </View>

        {/* Voice Input Button */}
        <View style={styles.voiceInputContainer}>
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

        {/* Patient Form */}
        <View style={styles.formContainer}>
          <BengaliTextInput
            label={BengaliText.PATIENT_NAME}
            value={patientData.name}
            onChangeText={(text) => setPatientData({...patientData, name: text})}
            placeholder={BengaliText.PATIENT_NAME}
          />
          
          <BengaliTextInput
            label={BengaliText.AGE}
            value={patientData.age}
            onChangeText={(text) => setPatientData({...patientData, age: text})}
            placeholder={BengaliText.AGE}
            keyboardType="numeric"
          />
          
          <BengaliTextInput
            label={BengaliText.LMP_DATE}
            value={patientData.lmpDate}
            onChangeText={(text) => setPatientData({...patientData, lmpDate: text})}
            placeholder={BengaliText.LMP_DATE}
          />
          
          <BengaliTextInput
            label={BengaliText.WEIGHT}
            value={patientData.weight}
            onChangeText={(text) => setPatientData({...patientData, weight: text})}
            placeholder={BengaliText.WEIGHT}
            keyboardType="numeric"
          />
          
          <BengaliTextInput
            label={BengaliText.HEIGHT}
            value={patientData.height}
            onChangeText={(text) => setPatientData({...patientData, height: text})}
            placeholder={BengaliText.HEIGHT}
          />
          
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
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  voiceInputContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
