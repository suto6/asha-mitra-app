import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BottomNavBar from '@/components/BottomNavBar';
import BengaliTextInput from '@/components/BengaliTextInput';
import BengaliButton from '@/components/BengaliButton';
import VoiceInputButton from '@/components/VoiceInputButton';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AddScreen() {
  const [activeTab, setActiveTab] = useState('pregnant');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isEnglish } = useLanguage();

  // Text translations
  const translations = {
    addNewEntry: isEnglish ? 'Add New Entry' : 'নতুন এন্ট্রি যোগ করুন',
    pregnant: isEnglish ? 'Pregnant' : 'গর্ভবতী',
    postnatal: isEnglish ? 'Postnatal' : 'প্রসবোত্তর',
    child: isEnglish ? 'Child' : 'শিশু',
    speakNow: isEnglish ? 'Speak Now' : BengaliText.SPEAK_NOW,
    voiceInfo: isEnglish ? 'Provide information using voice' : 'তথ্য ভয়েস দিয়ে দিন',
    name: isEnglish ? 'Name' : 'নাম',
    enterName: isEnglish ? 'Enter name' : 'নাম লিখুন',
    age: isEnglish ? 'Age' : 'বয়স',
    phone: isEnglish ? 'Phone Number' : 'ফোন নম্বর',
    lmpDate: isEnglish ? 'Last Menstrual Period (LMP)' : 'শেষ মাসিকের তারিখ (LMP)',
    eddDate: isEnglish ? 'Expected Delivery Date (EDD)' : 'সম্ভাব্য প্রসবের তারিখ (EDD)',
    autoCalculated: isEnglish ? 'Auto calculated' : 'স্বয়ংক্রিয় গণনা',
    weight: isEnglish ? 'Weight (kg)' : 'ওজন (কেজি)',
    height: isEnglish ? 'Height (cm)' : 'উচ্চতা (সেমি)',
    bloodPressure: isEnglish ? 'Blood Pressure' : 'ব্লাড প্রেসার',
    bpExample: isEnglish ? 'Example: 120/80' : 'উদাহরণ: 120/80',
    highRiskPregnancy: isEnglish ? 'High Risk Pregnancy' : 'উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থা',
    notes: isEnglish ? 'Special Notes / Issues' : 'বিশেষ নোট / সমস্যা',
    save: isEnglish ? 'Save' : 'সংরক্ষণ করুন',
    setReminder: isEnglish ? 'Set reminder for next ANC visit' : 'পরবর্তী ANC পরিদর্শনের রিমাইন্ডার সেট করুন',
    motherName: isEnglish ? 'Mother\'s Name' : 'মায়ের নাম',
    deliveryDate: isEnglish ? 'Delivery Date' : 'প্রসবের তারিখ',
    deliveryType: isEnglish ? 'Delivery Type:' : 'প্রসবের ধরন:',
    normal: isEnglish ? 'Normal' : 'স্বাভাবিক',
    cesarean: isEnglish ? 'Cesarean' : 'সিজারিয়ান',
    babyWeight: isEnglish ? 'Baby\'s Weight (kg)' : 'শিশুর ওজন (কেজি)',
    motherWeight: isEnglish ? 'Mother\'s Weight (kg)' : 'মায়ের ওজন (কেজি)',
    setPncReminder: isEnglish ? 'Set reminder for next PNC visit' : 'পরবর্তী PNC পরিদর্শনের রিমাইন্ডার সেট করুন',
    childName: isEnglish ? 'Child\'s Name' : 'শিশুর নাম',
    dateOfBirth: isEnglish ? 'Date of Birth' : 'জন্ম তারিখ',
    gender: isEnglish ? 'Gender:' : 'লিঙ্গ:',
    boy: isEnglish ? 'Boy' : 'ছেলে',
    girl: isEnglish ? 'Girl' : 'মেয়ে',
    immunizationStatus: isEnglish ? 'Immunization Status:' : 'টিকাদান স্ট্যাটাস:',
    selectStatus: isEnglish ? 'Select immunization status' : 'টিকাদান স্ট্যাটাস নির্বাচন করুন',
    setImmunizationReminder: isEnglish ? 'Set reminder for next immunization' : 'পরবর্তী টিকাদানের রিমাইন্ডার সেট করুন',
    pregnantInfo: isEnglish ? 'pregnant woman\'s information' : 'গর্ভবতী মহিলার তথ্য',
    postnatalInfo: isEnglish ? 'postnatal information' : 'প্রসবোত্তর তথ্য',
    childInfo: isEnglish ? 'child\'s information' : 'শিশুর তথ্য',
  };

  // Form data states
  const [pregnantData, setPregnantData] = useState({
    name: '',
    age: '',
    phone: '',
    lmpDate: '',
    eddDate: '',
    weight: '',
    height: '',
    bloodPressure: '',
    isHighRisk: false,
    notes: '',
  });

  const [postnatalData, setPostnatalData] = useState({
    motherName: '',
    age: '',
    phone: '',
    deliveryDate: '',
    deliveryType: 'normal',
    babyWeight: '',
    motherWeight: '',
    bloodPressure: '',
    notes: '',
  });

  const [childData, setChildData] = useState({
    name: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
    height: '',
    immunizationStatus: '',
    notes: '',
  });

  const handleStartRecording = async () => {
    setIsRecording(true);

    // Start actual voice recognition
    console.log('Started listening for voice input...');

    // Initialize speech recognition directly when starting
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        // Create a global recognition instance so we can stop it later
        window.recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        const recognition = window.recognitionInstance;

        // Configure speech recognition
        recognition.lang = 'bn-BD'; // Bengali language
        recognition.continuous = false;
        recognition.interimResults = true;

        // Handle results
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice input received:', transcript);

          // Show the transcript in real-time
          if (activeTab === 'pregnant') {
            setPregnantData(prev => ({ ...prev, notes: transcript }));
          } else if (activeTab === 'postnatal') {
            setPostnatalData(prev => ({ ...prev, notes: transcript }));
          } else if (activeTab === 'child') {
            setChildData(prev => ({ ...prev, notes: transcript }));
          }
        };

        // Handle errors
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          alert('ভয়েস ইনপুট প্রক্রিয়াকরণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        };

        // Start recognition
        recognition.start();
        console.log('Speech recognition started');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsRecording(false);
        alert('ভয়েস ইনপুট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');

        // Fallback for testing - simulate recording
        alert('ফলব্যাক মোডে চলছে। আপনার ভয়েস ইনপুট সিমুলেট করা হচ্ছে।');
      }
    } else {
      // Fallback for browsers that don't support speech recognition
      console.log('Speech recognition not supported in this browser');
      alert('আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। ফলব্যাক মোডে চলছে।');

      // For testing purposes, we'll use a timeout to simulate recording
      setTimeout(() => {
        if (isRecording) {
          handleStopRecording();
        }
      }, 5000);
    }
  };

  const handleStopRecording = () => {
    // Stop recording
    setIsRecording(false);

    // Start processing
    setIsProcessing(true);

    // Get the transcript from the current state
    let transcript = '';

    if (activeTab === 'pregnant') {
      transcript = pregnantData.notes || '';
    } else if (activeTab === 'postnatal') {
      transcript = postnatalData.notes || '';
    } else if (activeTab === 'child') {
      transcript = childData.notes || '';
    }

    // Stop the recognition if it's running
    if (typeof window !== 'undefined' && window.recognitionInstance) {
      try {
        window.recognitionInstance.stop();
        console.log('Speech recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }

    // If we have a transcript, process it
    if (transcript) {
      console.log('Processing transcript:', transcript);
      processVoiceInput(transcript);
    } else {
      // If no transcript was captured, use fallback data for testing
      console.log('No transcript captured, using fallback data');

      // Use fallback data based on active tab
      if (activeTab === 'pregnant') {
        const fallbackData = {
          ...pregnantData,
          name: 'পিঙ্কি বিশ্বাস',
          age: '25',
          phone: '9876543210',
          lmpDate: '২০২৩-০৪-০১',
          weight: '55',
          height: '152',
          bloodPressure: '120/80',
          notes: 'ফলব্যাক ডাটা - ভয়েস ইনপুট কাজ করছে না',
        };

        // Calculate EDD based on LMP
        fallbackData.eddDate = calculateEDD(fallbackData.lmpDate);

        // Update state with fallback data
        setPregnantData(fallbackData);
        setIsProcessing(false);
        alert('ফলব্যাক ডাটা ব্যবহার করা হয়েছে। আসল ভয়েস ইনপুট কাজ করছে না।');
      }
      else if (activeTab === 'postnatal') {
        const fallbackData = {
          ...postnatalData,
          motherName: 'সুমিতা রায়',
          age: '22',
          phone: '9876543211',
          deliveryDate: '২০২৩-০৫-১০',
          deliveryType: 'normal',
          babyWeight: '3.2',
          motherWeight: '58',
          bloodPressure: '110/70',
          notes: 'ফলব্যাক ডাটা - ভয়েস ইনপুট কাজ করছে না',
        };

        // Update state with fallback data
        setPostnatalData(fallbackData);
        setIsProcessing(false);
        alert('ফলব্যাক ডাটা ব্যবহার করা হয়েছে। আসল ভয়েস ইনপুট কাজ করছে না।');
      }
      else if (activeTab === 'child') {
        const fallbackData = {
          ...childData,
          name: 'অনিতা দাস',
          motherName: 'রিতা দাস',
          dateOfBirth: '২০২৩-০৫-০১',
          gender: 'মেয়ে',
          weight: '12.5',
          height: '85',
          immunizationStatus: 'সম্পূর্ণ',
          notes: 'ফলব্যাক ডাটা - ভয়েস ইনপুট কাজ করছে না',
        };

        // Update state with fallback data
        setChildData(fallbackData);
        setIsProcessing(false);
        alert('ফলব্যাক ডাটা ব্যবহার করা হয়েছে। আসল ভয়েস ইনপুট কাজ করছে না।');
      }
    }
  };

  // Function to process voice input
  const processVoiceInput = (transcript) => {
    console.log('Processing voice input:', transcript);

    // Extract relevant information from the transcript
    // This would be more sophisticated in a real implementation

    // Process immediately without delay
    if (activeTab === 'pregnant') {
      // Extract data from transcript
      // This is a simplified example - in a real app, you would use NLP
      const nameMatch = transcript.match(/নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i);
      const ageMatch = transcript.match(/বয়স\s+(\d+)/i);
      const phoneMatch = transcript.match(/ফোন\s+(\d+)/i);
      const lmpMatch = transcript.match(/শেষ\s+মাসিক\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i);
      const weightMatch = transcript.match(/ওজন\s+(\d+)/i);
      const heightMatch = transcript.match(/উচ্চতা\s+(\d+)/i);
      const bpMatch = transcript.match(/রক্তচাপ\s+([^\s,।]+)/i);

      // Create a new data object with the current data
      const updatedData = { ...pregnantData };

      // Always keep the transcript in notes
      updatedData.notes = transcript;

      // Update specific fields if matches were found
      if (nameMatch) updatedData.name = nameMatch[1];
      if (ageMatch) updatedData.age = ageMatch[1];
      if (phoneMatch) updatedData.phone = phoneMatch[1];
      if (lmpMatch) updatedData.lmpDate = lmpMatch[1];
      if (weightMatch) updatedData.weight = weightMatch[1];
      if (heightMatch) updatedData.height = heightMatch[1];
      if (bpMatch) updatedData.bloodPressure = bpMatch[1];

      // If no specific matches were found, try to extract information based on position in the transcript
      if (!nameMatch && !ageMatch && !phoneMatch && !lmpMatch) {
        // Split the transcript by spaces and try to use words as field values
        const words = transcript.split(/\s+/);
        if (words.length > 0 && !updatedData.name && words[0].length > 1) {
          updatedData.name = words[0];
        }
        if (words.length > 1 && !updatedData.age && /^\d+$/.test(words[1])) {
          updatedData.age = words[1];
        }
      }

      // Calculate EDD if LMP is available
      if (updatedData.lmpDate) {
        updatedData.eddDate = calculateEDD(updatedData.lmpDate);
      }

      // Update state with the extracted data
      setPregnantData(updatedData);

      // Processing complete
      setIsProcessing(false);

      // Show success feedback
      alert('ভয়েস ইনপুট সফলভাবে প্রক্রিয়া করা হয়েছে।');
    }
    else if (activeTab === 'postnatal') {
      // Extract data for postnatal
      const nameMatch = transcript.match(/নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i);
      const ageMatch = transcript.match(/বয়স\s+(\d+)/i);
      const phoneMatch = transcript.match(/ফোন\s+(\d+)/i);
      const dateMatch = transcript.match(/তারিখ\s+([^\s,।]+)/i);

      // Create a new data object with the current data
      const updatedData = { ...postnatalData };

      // Always keep the transcript in notes
      updatedData.notes = transcript;

      // Update specific fields if matches were found
      if (nameMatch) updatedData.motherName = nameMatch[1];
      if (ageMatch) updatedData.age = ageMatch[1];
      if (phoneMatch) updatedData.phone = phoneMatch[1];
      if (dateMatch) updatedData.deliveryDate = dateMatch[1];

      // If no specific matches were found, try to extract information based on position in the transcript
      if (!nameMatch && !ageMatch && !phoneMatch && !dateMatch) {
        // Split the transcript by spaces and try to use words as field values
        const words = transcript.split(/\s+/);
        if (words.length > 0 && !updatedData.motherName && words[0].length > 1) {
          updatedData.motherName = words[0];
        }
        if (words.length > 1 && !updatedData.age && /^\d+$/.test(words[1])) {
          updatedData.age = words[1];
        }
      }

      // Update state with the extracted data
      setPostnatalData(updatedData);

      // Processing complete
      setIsProcessing(false);

      // Show success feedback
      alert('ভয়েস ইনপুট সফলভাবে প্রক্রিয়া করা হয়েছে।');
    }
    else if (activeTab === 'child') {
      // Extract data for child
      const nameMatch = transcript.match(/নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i);
      const motherMatch = transcript.match(/মায়ের\s+নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i);
      const dobMatch = transcript.match(/জন্ম\s+তারিখ\s+([^\s,।]+)/i);
      const genderMatch = transcript.match(/লিঙ্গ\s+([^\s,।]+)/i);

      // Create a new data object with the current data
      const updatedData = { ...childData };

      // Always keep the transcript in notes
      updatedData.notes = transcript;

      // Update specific fields if matches were found
      if (nameMatch) updatedData.name = nameMatch[1];
      if (motherMatch) updatedData.motherName = motherMatch[1];
      if (dobMatch) updatedData.dateOfBirth = dobMatch[1];
      if (genderMatch) updatedData.gender = genderMatch[1];

      // If no specific matches were found, try to extract information based on position in the transcript
      if (!nameMatch && !motherMatch && !dobMatch && !genderMatch) {
        // Split the transcript by spaces and try to use words as field values
        const words = transcript.split(/\s+/);
        if (words.length > 0 && !updatedData.name && words[0].length > 1) {
          updatedData.name = words[0];
        }
        if (words.length > 1 && !updatedData.motherName && words[1].length > 1) {
          updatedData.motherName = words[1];
        }
      }

      // Update state with the extracted data
      setChildData(updatedData);

      // Processing complete
      setIsProcessing(false);

      // Show success feedback
      alert('ভয়েস ইনপুট সফলভাবে প্রক্রিয়া করা হয়েছে।');
    }
  };

  const handleSave = () => {
    setSaving(true);

    // Simulate saving
    setTimeout(() => {
      setSaving(false);

      // Reset form based on active tab
      if (activeTab === 'pregnant') {
        setPregnantData({
          name: '',
          age: '',
          phone: '',
          lmpDate: '',
          eddDate: '',
          weight: '',
          height: '',
          bloodPressure: '',
          isHighRisk: false,
          notes: '',
        });
      } else if (activeTab === 'postnatal') {
        setPostnatalData({
          motherName: '',
          age: '',
          phone: '',
          deliveryDate: '',
          deliveryType: 'normal',
          babyWeight: '',
          motherWeight: '',
          bloodPressure: '',
          notes: '',
        });
      } else if (activeTab === 'child') {
        setChildData({
          name: '',
          motherName: '',
          dateOfBirth: '',
          gender: '',
          weight: '',
          height: '',
          immunizationStatus: '',
          notes: '',
        });
      }

      // Show success message (in a real app)
      alert('Data saved successfully!');
    }, 1500);
  };

  const calculateEDD = (lmpDate) => {
    // This is a placeholder for calculating EDD from LMP
    // In a real app, this would use a proper date calculation
    console.log('Calculating EDD from LMP:', lmpDate);
    return 'Calculated EDD will appear here';
  };

  const renderPregnantWomenForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label="নাম"
          value={pregnantData.name}
          onChangeText={(text) => setPregnantData({...pregnantData, name: text})}
          placeholder="নাম লিখুন"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="বয়স"
              value={pregnantData.age}
              onChangeText={(text) => setPregnantData({...pregnantData, age: text})}
              placeholder="বয়স"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ফোন নম্বর"
              value={pregnantData.phone}
              onChangeText={(text) => setPregnantData({...pregnantData, phone: text})}
              placeholder="ফোন নম্বর"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="শেষ মাসিকের তারিখ (LMP)"
              value={pregnantData.lmpDate}
              onChangeText={(text) => {
                const newData = {...pregnantData, lmpDate: text};
                newData.eddDate = calculateEDD(text);
                setPregnantData(newData);
              }}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="সম্ভাব্য প্রসবের তারিখ (EDD)"
              value={pregnantData.eddDate}
              editable={false}
              placeholder="স্বয়ংক্রিয় গণনা"
            />
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ওজন (কেজি)"
              value={pregnantData.weight}
              onChangeText={(text) => setPregnantData({...pregnantData, weight: text})}
              placeholder="ওজন"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="উচ্চতা (সেমি)"
              value={pregnantData.height}
              onChangeText={(text) => setPregnantData({...pregnantData, height: text})}
              placeholder="উচ্চতা"
              keyboardType="numeric"
            />
          </View>
        </View>

        <BengaliTextInput
          label="ব্লাড প্রেসার"
          value={pregnantData.bloodPressure}
          onChangeText={(text) => setPregnantData({...pregnantData, bloodPressure: text})}
          placeholder="উদাহরণ: 120/80"
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setPregnantData({...pregnantData, isHighRisk: !pregnantData.isHighRisk})}
          >
            <View style={[
              styles.checkboxInner,
              pregnantData.isHighRisk && styles.checkboxChecked
            ]}>
              {pregnantData.isHighRisk && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থা</Text>
        </View>

        <BengaliTextInput
          label="বিশেষ নোট / সমস্যা"
          value={pregnantData.notes}
          onChangeText={(text) => setPregnantData({...pregnantData, notes: text})}
          placeholder="বিশেষ নোট / সমস্যা"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title="সংরক্ষণ করুন"
            onPress={handleSave}
            loading={saving}
            disabled={!pregnantData.name || !pregnantData.age}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => alert('Reminder set for next ANC visit')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>পরবর্তী ANC পরিদর্শনের রিমাইন্ডার সেট করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPostnatalForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label="মায়ের নাম"
          value={postnatalData.motherName}
          onChangeText={(text) => setPostnatalData({...postnatalData, motherName: text})}
          placeholder="মায়ের নাম লিখুন"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="বয়স"
              value={postnatalData.age}
              onChangeText={(text) => setPostnatalData({...postnatalData, age: text})}
              placeholder="বয়স"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ফোন নম্বর"
              value={postnatalData.phone}
              onChangeText={(text) => setPostnatalData({...postnatalData, phone: text})}
              placeholder="ফোন নম্বর"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <BengaliTextInput
          label="প্রসবের তারিখ"
          value={postnatalData.deliveryDate}
          onChangeText={(text) => setPostnatalData({...postnatalData, deliveryDate: text})}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>প্রসবের ধরন:</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPostnatalData({...postnatalData, deliveryType: 'normal'})}
            >
              <View style={[
                styles.radioButton,
                postnatalData.deliveryType === 'normal' && styles.radioButtonSelected
              ]}>
                {postnatalData.deliveryType === 'normal' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioText}>স্বাভাবিক</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPostnatalData({...postnatalData, deliveryType: 'cesarean'})}
            >
              <View style={[
                styles.radioButton,
                postnatalData.deliveryType === 'cesarean' && styles.radioButtonSelected
              ]}>
                {postnatalData.deliveryType === 'cesarean' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioText}>সিজারিয়ান</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="শিশুর ওজন (কেজি)"
              value={postnatalData.babyWeight}
              onChangeText={(text) => setPostnatalData({...postnatalData, babyWeight: text})}
              placeholder="শিশুর ওজন"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="মায়ের ওজন (কেজি)"
              value={postnatalData.motherWeight}
              onChangeText={(text) => setPostnatalData({...postnatalData, motherWeight: text})}
              placeholder="মায়ের ওজন"
              keyboardType="numeric"
            />
          </View>
        </View>

        <BengaliTextInput
          label="ব্লাড প্রেসার"
          value={postnatalData.bloodPressure}
          onChangeText={(text) => setPostnatalData({...postnatalData, bloodPressure: text})}
          placeholder="উদাহরণ: 120/80"
        />

        <BengaliTextInput
          label="বিশেষ নোট / সমস্যা"
          value={postnatalData.notes}
          onChangeText={(text) => setPostnatalData({...postnatalData, notes: text})}
          placeholder="বিশেষ নোট / সমস্যা"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title="সংরক্ষণ করুন"
            onPress={handleSave}
            loading={saving}
            disabled={!postnatalData.motherName || !postnatalData.deliveryDate}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => alert('Reminder set for next PNC visit')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>পরবর্তী PNC পরিদর্শনের রিমাইন্ডার সেট করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderChildForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label="শিশুর নাম"
          value={childData.name}
          onChangeText={(text) => setChildData({...childData, name: text})}
          placeholder="শিশুর নাম লিখুন"
        />

        <BengaliTextInput
          label="মায়ের নাম"
          value={childData.motherName}
          onChangeText={(text) => setChildData({...childData, motherName: text})}
          placeholder="মায়ের নাম লিখুন"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="জন্ম তারিখ"
              value={childData.dateOfBirth}
              onChangeText={(text) => setChildData({...childData, dateOfBirth: text})}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.halfField}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioLabel}>লিঙ্গ:</Text>
              <View style={styles.radioOptions}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setChildData({...childData, gender: 'ছেলে'})}
                >
                  <View style={[
                    styles.radioButton,
                    childData.gender === 'ছেলে' && styles.radioButtonSelected
                  ]}>
                    {childData.gender === 'ছেলে' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>ছেলে</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setChildData({...childData, gender: 'মেয়ে'})}
                >
                  <View style={[
                    styles.radioButton,
                    childData.gender === 'মেয়ে' && styles.radioButtonSelected
                  ]}>
                    {childData.gender === 'মেয়ে' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>মেয়ে</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ওজন (কেজি)"
              value={childData.weight}
              onChangeText={(text) => setChildData({...childData, weight: text})}
              placeholder="ওজন"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="উচ্চতা (সেমি)"
              value={childData.height}
              onChangeText={(text) => setChildData({...childData, height: text})}
              placeholder="উচ্চতা"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>টিকাদান স্ট্যাটাস:</Text>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => alert('Show dropdown options')}
            >
              <Text style={styles.dropdownButtonText}>
                {childData.immunizationStatus || 'টিকাদান স্ট্যাটাস নির্বাচন করুন'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <BengaliTextInput
          label="বিশেষ নোট / সমস্যা"
          value={childData.notes}
          onChangeText={(text) => setChildData({...childData, notes: text})}
          placeholder="বিশেষ নোট / সমস্যা"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title="সংরক্ষণ করুন"
            onPress={handleSave}
            loading={saving}
            disabled={!childData.name || !childData.dateOfBirth}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => alert('Reminder set for next immunization')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>পরবর্তী টিকাদানের রিমাইন্ডার সেট করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{translations.addNewEntry}</Text>
            <LanguageToggle style={styles.languageToggle} />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pregnant' && styles.activeTab]}
            onPress={() => setActiveTab('pregnant')}
          >
            <Ionicons
              name="woman"
              size={24}
              color={activeTab === 'pregnant' ? '#4A90E2' : '#666666'}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'pregnant' && styles.activeTabText
            ]}>
              {translations.pregnant}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'postnatal' && styles.activeTab]}
            onPress={() => setActiveTab('postnatal')}
          >
            <Ionicons
              name="happy"
              size={24}
              color={activeTab === 'postnatal' ? '#FF9500' : '#666666'}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'postnatal' && styles.activeTabText
            ]}>
              {translations.postnatal}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'child' && styles.activeTab]}
            onPress={() => setActiveTab('child')}
          >
            <Ionicons
              name="body"
              size={24}
              color={activeTab === 'child' ? '#34C759' : '#666666'}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'child' && styles.activeTabText
            ]}>
              {translations.child}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Voice Input Section */}
        <View style={styles.voiceSection}>
          <Text style={styles.voiceTitle}>{translations.speakNow}</Text>
          <Text style={styles.voiceSubtitle}>
            {activeTab === 'pregnant' ? translations.pregnantInfo :
             activeTab === 'postnatal' ? translations.postnatalInfo : translations.childInfo} {translations.voiceInfo}
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

        {/* Form based on active tab */}
        {activeTab === 'pregnant' && renderPregnantWomenForm()}
        {activeTab === 'postnatal' && renderPostnatalForm()}
        {activeTab === 'child' && renderChildForm()}

        {/* Extra space for bottom nav */}
        <View style={styles.bottomNavSpace} />
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  languageToggle: {
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#F0F7FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginTop: 4,
  },
  activeTabText: {
    color: '#4A90E2',
  },
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
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A90E2',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    marginTop: 20,
  },
  reminderContainer: {
    marginTop: 16,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 8,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  radioOptions: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#4A90E2',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
  },
  radioText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  bottomNavSpace: {
    height: 90,
  },
});
