import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import VoiceInputButton from '@/components/VoiceInputButton';
import AlertBox from '@/components/AlertBox';
import { useAuth } from '@/contexts/AuthContext';
import { startVoiceRecognition, parsePatientData, speakBengali } from '@/utils/voiceRecognition';
import { analyzeHealthData, processHealthAlerts } from '@/utils/healthAnalysis';
import { getPatientDetails, addHealthRecord } from '@/services/firebaseService';

export default function AddHealthRecordScreen() {
  const { patientId } = useLocalSearchParams();
  const { currentUser } = useAuth();
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

  useEffect(() => {
    // In a real implementation, we would fetch patient details
    // For demo purposes, we're using simulated data
    
    // Simulate API call
    setTimeout(() => {
      // Simulated patient data
      const simulatedPatient = {
        id: patientId,
        name: 'পিঙ্কি বিশ্বাস',
        age: '25',
      };
      
      setPatient(simulatedPatient);
      setLoading(false);
    }, 1000);
  }, [patientId]);

  // Function to handle starting voice recording
  const handleStartRecording = async () => {
    setIsRecording(true);
    
    // In a real implementation, we would start actual voice recognition here
    // For demo purposes, we're simulating voice recognition
    
    // Simulate voice recognition with Bengali text
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
        "শেষ মাসিকের তারিখ ২০২৩-০৪-০১, " +
        "ওজন ৫৫ কেজি, উচ্চতা ৫ ফুট ২ ইঞ্চি, ব্লাড প্রেসার ১৪০/৯০, বিশেষ কোনো সমস্যা নেই।";
      
      // Parse the voice input
      const parsedData = {
        lmpDate: '২০২৩-০৪-০১',
        weight: '৫৫',
        height: '৫ ফুট ২ ইঞ্চি',
        bloodPressure: '১৪০/৯০',
        notes: 'বিশেষ কোনো সমস্যা নেই।',
      };
      
      setHealthData(parsedData);
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

  // Function to save health record
  const handleSaveRecord = async () => {
    if (!healthData.lmpDate && !healthData.weight && !healthData.bloodPressure) {
      Alert.alert(BengaliText.ERROR, 'অন্তত একটি স্বাস্থ্য তথ্য দিন');
      return;
    }
    
    setSaving(true);
    
    try {
      // In a real implementation, we would save to the database
      // For demo purposes, we're simulating API call
      
      setTimeout(() => {
        Alert.alert(BengaliText.DATA_SAVED, '', [
          { 
            text: BengaliText.CONFIRM, 
            onPress: () => {
              // Navigate back to patient details
              router.back();
            }
          }
        ]);
        setSaving(false);
      }, 1000);
      
    } catch (error) {
      Alert.alert(BengaliText.ERROR, error.message);
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
          <Text style={styles.title}>নতুন স্বাস্থ্য রেকর্ড</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientName}>{patient?.name}</Text>
          <Text style={styles.patientDetails}>
            {BengaliText.AGE}: {patient?.age}
          </Text>
        </View>

        {/* Voice Input Button */}
        <View style={styles.voiceInputContainer}>
          <Text style={styles.voiceInputLabel}>
            স্বাস্থ্য তথ্য ভয়েস দিয়ে দিন
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
            label={BengaliText.LMP_DATE}
            value={healthData.lmpDate}
            onChangeText={(text) => setHealthData({...healthData, lmpDate: text})}
            placeholder={BengaliText.LMP_DATE}
          />
          
          <BengaliTextInput
            label={BengaliText.WEIGHT}
            value={healthData.weight}
            onChangeText={(text) => setHealthData({...healthData, weight: text})}
            placeholder={BengaliText.WEIGHT}
            keyboardType="numeric"
          />
          
          <BengaliTextInput
            label={BengaliText.HEIGHT}
            value={healthData.height}
            onChangeText={(text) => setHealthData({...healthData, height: text})}
            placeholder={BengaliText.HEIGHT}
          />
          
          <BengaliTextInput
            label={BengaliText.BLOOD_PRESSURE}
            value={healthData.bloodPressure}
            onChangeText={(text) => setHealthData({...healthData, bloodPressure: text})}
            placeholder={BengaliText.BLOOD_PRESSURE}
          />
          
          <BengaliTextInput
            label={BengaliText.NOTES}
            value={healthData.notes}
            onChangeText={(text) => setHealthData({...healthData, notes: text})}
            placeholder={BengaliText.NOTES}
            multiline={true}
            numberOfLines={4}
          />
          
          <View style={styles.buttonContainer}>
            <BengaliButton
              title={BengaliText.SAVE}
              onPress={handleSaveRecord}
              loading={saving}
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
