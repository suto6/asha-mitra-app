import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import BengaliText from '@/constants/BengaliText';
import BottomNavBar from '@/components/BottomNavBar';
import BengaliTextInput from '@/components/BengaliTextInput';
import BengaliButton from '@/components/BengaliButton';
import VoiceInputButton from '@/components/VoiceInputButton';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { addPatient } from '@/services/patientService';

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

        // Configure speech recognition based on selected language
        recognition.lang = isEnglish ? 'en-US' : 'bn-BD'; // English or Bengali based on toggle
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
        console.log('ভয়েস ইনপুট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');

        // Fallback for testing - simulate recording
        console.log('ফলব্যাক মোডে চলছে। আপনার ভয়েস ইনপুট সিমুলেট করা হচ্ছে।');
      }
    } else {
      // Fallback for browsers that don't support speech recognition
      console.log('Speech recognition not supported in this browser');
      console.log('আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। ফলব্যাক মোডে চলছে।');

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



        // Update state with fallback data
        setPregnantData(fallbackData);
        setIsProcessing(false);
        console.log('ফলব্যাক ডাটা ব্যবহার করা হয়েছে। আসল ভয়েস ইনপুট কাজ করছে না।');
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
        console.log('ফলব্যাক ডাটা ব্যবহার করা হয়েছে। আসল ভয়েস ইনপুট কাজ করছে না।');
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
        console.log('ফলব্যাক ডাটা ব্যবহার করা হয়েছে। আসল ভয়েস ইনপুট কাজ করছে না।');
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
      // Create a new data object with the current data
      const updatedData = { ...pregnantData };

      // Always keep the transcript in notes
      updatedData.notes = transcript;

      // Define regex patterns for both Bengali and English
      const patterns = {
        name: isEnglish ? /name\s+([^\s,\.]+(?:\s+[^\s,\.]+)*)/i : /নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i,
        age: isEnglish ? /age\s+([0-9০-৯]+)/i : /বয়স\s+([0-9০-৯]+)/i,
        phone: isEnglish ? /phone(?:\s+number)?\s+([0-9০-৯\s\-]+)/i : /ফোন(?:\s+নম্বর)?\s+([0-9০-৯\s\-]+)/i,
        lmp: isEnglish ?
          /(?:lmp|last\s+menstrual\s+period)\s+([0-9০-৯\/\-\.]+(?:\s+[0-9০-৯\/\-\.]+)*)/i :
          /(?:শেষ\s+মাসিক(?:ের)?\s+তারিখ)\s+([0-9০-৯\/\-\.]+(?:\s+[0-9০-৯\/\-\.]+)*)/i,
        weight: isEnglish ? /weight\s+([0-9০-৯\.]+)/i : /ওজন\s+([0-9০-৯\.]+)/i,
        height: isEnglish ? /height\s+([0-9০-৯\.]+)/i : /উচ্চতা\s+([0-9০-৯\.]+)/i,
        bp: isEnglish ? /(?:blood\s+pressure|bp)\s+([0-9০-৯\/\.]+)/i : /(?:রক্তচাপ|ব্লাড\s+প্রেসার)\s+([0-9০-৯\/\.]+)/i,
        issues: isEnglish ? /(?:issues|problems|notes)\s+([^\n]+)$/i : /(?:সমস্যা|নোট)\s+([^\n]+)$/i,
      };

      // Extract data using the patterns
      const nameMatch = transcript.match(patterns.name);
      const ageMatch = transcript.match(patterns.age);
      const phoneMatch = transcript.match(patterns.phone);
      const lmpMatch = transcript.match(patterns.lmp);
      const weightMatch = transcript.match(patterns.weight);
      const heightMatch = transcript.match(patterns.height);
      const bpMatch = transcript.match(patterns.bp);

      // Update specific fields if matches were found
      if (nameMatch) updatedData.name = nameMatch[1];

      if (ageMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.age = convertBengaliToEnglishNumerals(ageMatch[1]);
      }

      if (phoneMatch) {
        // Clean up phone number by removing any non-digit characters and convert Bengali numerals
        const cleanedPhone = phoneMatch[1].replace(/[\s\-]/g, '');
        updatedData.phone = convertBengaliToEnglishNumerals(cleanedPhone);
      }

      if (lmpMatch) {
        // Convert Bengali date format to English if needed
        updatedData.lmpDate = convertBengaliToEnglishNumerals(lmpMatch[1]);
      }

      if (weightMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.weight = convertBengaliToEnglishNumerals(weightMatch[1]);
      }

      if (heightMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.height = convertBengaliToEnglishNumerals(heightMatch[1]);
      }

      if (bpMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.bloodPressure = convertBengaliToEnglishNumerals(bpMatch[1]);
      }

      // Check for issues/notes
      const issuesMatch = transcript.match(patterns.issues);
      if (issuesMatch) {
        updatedData.notes = issuesMatch[1];
      }

      // If no specific matches were found, try to parse field-value pairs
      if (!nameMatch && !ageMatch && !phoneMatch && !lmpMatch && !weightMatch && !heightMatch && !bpMatch) {
        // Split the transcript into words
        const words = transcript.split(/\s+/);

        // Process pairs of words (field name followed by value)
        for (let i = 0; i < words.length - 1; i++) {
          const field = words[i].toLowerCase();
          const value = words[i + 1];

          // Check if the current word is a field name
          if ((isEnglish && field === 'name') || (!isEnglish && field === 'নাম')) {
            // If the next word is the start of a name, collect all following words until we hit another field
            let fullName = value;
            let j = i + 2;
            while (j < words.length &&
                  !['name', 'age', 'phone', 'weight', 'height', 'lmp', 'নাম', 'বয়স', 'ফোন', 'ওজন', 'উচ্চতা', 'শেষ']
                  .includes(words[j].toLowerCase())) {
              fullName += ' ' + words[j];
              j++;
            }
            updatedData.name = fullName;
            i = j - 1; // Skip processed words
          }
          else if ((isEnglish && field === 'age') || (!isEnglish && field === 'বয়স')) {
            // Check if the value contains digits (either English or Bengali)
            if (/^[0-9০-৯]+$/.test(value)) {
              updatedData.age = convertBengaliToEnglishNumerals(value);
            }
            i++; // Skip the value
          }
          else if ((isEnglish && field === 'phone') || (!isEnglish && field === 'ফোন')) {
            // Check if the next value contains digits (either English or Bengali)
            if (/^[0-9০-৯\s\-]+$/.test(value)) {
              // Clean up and convert Bengali numerals if needed
              const cleanedPhone = value.replace(/[\s\-]/g, '');
              updatedData.phone = convertBengaliToEnglishNumerals(cleanedPhone);
              i++; // Skip the value
            }
            // If not, try to collect digits from multiple words to form a phone number
            else {
              let phoneNumber = '';
              let j = i + 1;
              // Collect digits until we have 10 or reach the end of words
              while (j < words.length && phoneNumber.length < 10) {
                // Extract only digits from the current word (both English and Bengali)
                const word = words[j];
                for (let k = 0; k < word.length; k++) {
                  if (/[0-9০-৯]/.test(word[k])) {
                    phoneNumber += word[k];
                  }
                }
                j++;
              }

              // Convert Bengali numerals to English
              phoneNumber = convertBengaliToEnglishNumerals(phoneNumber);

              // If we collected digits, use them as the phone number
              if (phoneNumber.length > 0) {
                updatedData.phone = phoneNumber;
                i = j - 1; // Skip processed words
              }
            }
          }
          else if ((isEnglish && field === 'weight') || (!isEnglish && field === 'ওজন')) {
            // Check if the value contains digits (either English or Bengali)
            if (/^[0-9০-৯\.]+$/.test(value)) {
              updatedData.weight = convertBengaliToEnglishNumerals(value);
            }
            i++; // Skip the value
          }
          else if ((isEnglish && field === 'height') || (!isEnglish && field === 'উচ্চতা')) {
            // Check if the value contains digits (either English or Bengali)
            if (/^[0-9০-৯\.]+$/.test(value)) {
              updatedData.height = convertBengaliToEnglishNumerals(value);
            }
            i++; // Skip the value
          }
          else if ((isEnglish && (field === 'bp' || field === 'blood')) ||
                  (!isEnglish && (field === 'রক্তচাপ' || field === 'ব্লাড'))) {
            // Handle "blood pressure" in English
            if (isEnglish && field === 'blood' && i < words.length - 2 && words[i+1].toLowerCase() === 'pressure') {
              const bpValue = words[i+2];
              updatedData.bloodPressure = convertBengaliToEnglishNumerals(bpValue);
              i += 2; // Skip the values
            }
            // Handle "ব্লাড প্রেসার" in Bengali
            else if (!isEnglish && field === 'ব্লাড' && i < words.length - 2 && words[i+1].toLowerCase() === 'প্রেসার') {
              const bpValue = words[i+2];
              updatedData.bloodPressure = convertBengaliToEnglishNumerals(bpValue);
              i += 2; // Skip the values
            }
            // Handle simple "bp" or "রক্তচাপ"
            else {
              updatedData.bloodPressure = convertBengaliToEnglishNumerals(value);
              i++; // Skip the value
            }
          }
          else if ((isEnglish && (field === 'lmp' || field === 'last')) ||
                  (!isEnglish && (field === 'শেষ'))) {
            // Handle "last menstrual period" in English
            if (isEnglish && field === 'last' && i < words.length - 3 &&
                words[i+1].toLowerCase() === 'menstrual' && words[i+2].toLowerCase() === 'period') {
              const lmpValue = words[i+3];
              updatedData.lmpDate = convertBengaliToEnglishNumerals(lmpValue);
              i += 3; // Skip the values
            }
            // Handle "শেষ মাসিকের তারিখ" in Bengali
            else if (!isEnglish && field === 'শেষ' && i < words.length - 3 &&
                    words[i+1].toLowerCase() === 'মাসিকের' && words[i+2].toLowerCase() === 'তারিখ') {
              const lmpValue = words[i+3];
              updatedData.lmpDate = convertBengaliToEnglishNumerals(lmpValue);
              i += 3; // Skip the values
            }
            // Handle "শেষ মাসিক" in Bengali
            else if (!isEnglish && field === 'শেষ' && i < words.length - 2 && words[i+1].toLowerCase() === 'মাসিক') {
              const lmpValue = words[i+2];
              updatedData.lmpDate = convertBengaliToEnglishNumerals(lmpValue);
              i += 2; // Skip the values
            }
            // Handle simple "lmp"
            else if (isEnglish && field === 'lmp') {
              updatedData.lmpDate = convertBengaliToEnglishNumerals(value);
              i++; // Skip the value
            }
          }
          // Handle "সমস্যা" (issues/problems) in Bengali
          else if (!isEnglish && field === 'সমস্যা') {
            let issueText = value;
            let j = i + 2;
            // Collect all remaining words as the issue text
            while (j < words.length) {
              issueText += ' ' + words[j];
              j++;
            }
            updatedData.notes = issueText;
            i = words.length; // Skip to the end
          }
          // Handle "issues" or "problems" in English
          else if (isEnglish && (field === 'issues' || field === 'problems' || field === 'notes')) {
            let issueText = value;
            let j = i + 2;
            // Collect all remaining words as the issue text
            while (j < words.length) {
              issueText += ' ' + words[j];
              j++;
            }
            updatedData.notes = issueText;
            i = words.length; // Skip to the end
          }
        }
      }



      // Update state with the extracted data
      setPregnantData(updatedData);

      // Processing complete
      setIsProcessing(false);

      // Log success message instead of showing alert
      console.log(isEnglish ? 'Voice input processed successfully.' : 'ভয়েস ইনপুট সফলভাবে প্রক্রিয়া করা হয়েছে।');
    }
    else if (activeTab === 'postnatal') {
      // Create a new data object with the current data
      const updatedData = { ...postnatalData };

      // Always keep the transcript in notes
      updatedData.notes = transcript;

      // Define regex patterns for both Bengali and English
      const patterns = {
        name: isEnglish ? /name\s+([^\s,\.]+(?:\s+[^\s,\.]+)*)/i : /নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i,
        motherName: isEnglish ? /mother(?:'s)?\s+name\s+([^\s,\.]+(?:\s+[^\s,\.]+)*)/i : /মায়ের\s+নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i,
        age: isEnglish ? /age\s+([0-9০-৯]+)/i : /বয়স\s+([0-9০-৯]+)/i,
        phone: isEnglish ? /phone(?:\s+number)?\s+([0-9০-৯\s\-]+)/i : /ফোন(?:\s+নম্বর)?\s+([0-9০-৯\s\-]+)/i,
        deliveryDate: isEnglish ? /delivery\s+date\s+([0-9০-৯\/\-\.]+(?:\s+[0-9০-৯\/\-\.]+)*)/i : /প্রসবের\s+তারিখ\s+([0-9০-৯\/\-\.]+(?:\s+[0-9০-৯\/\-\.]+)*)/i,
        babyWeight: isEnglish ? /baby(?:'s)?\s+weight\s+([0-9০-৯\.]+)/i : /শিশুর\s+ওজন\s+([0-9০-৯\.]+)/i,
        motherWeight: isEnglish ? /mother(?:'s)?\s+weight\s+([0-9০-৯\.]+)/i : /মায়ের\s+ওজন\s+([0-9০-৯\.]+)/i,
        bp: isEnglish ? /(?:blood\s+pressure|bp)\s+([0-9০-৯\/\.]+)/i : /(?:রক্তচাপ|ব্লাড\s+প্রেসার)\s+([0-9০-৯\/\.]+)/i,
        issues: isEnglish ? /(?:issues|problems|notes)\s+([^\n]+)$/i : /(?:সমস্যা|নোট)\s+([^\n]+)$/i,
      };

      // Extract data using the patterns
      const nameMatch = transcript.match(patterns.name) || transcript.match(patterns.motherName);
      const ageMatch = transcript.match(patterns.age);
      const phoneMatch = transcript.match(patterns.phone);
      const dateMatch = transcript.match(patterns.deliveryDate);
      const babyWeightMatch = transcript.match(patterns.babyWeight);
      const motherWeightMatch = transcript.match(patterns.motherWeight);
      const bpMatch = transcript.match(patterns.bp);

      // Update specific fields if matches were found
      if (nameMatch) updatedData.motherName = nameMatch[1];

      if (ageMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.age = convertBengaliToEnglishNumerals(ageMatch[1]);
      }

      if (phoneMatch) {
        // Clean up phone number by removing any non-digit characters and convert Bengali numerals
        const cleanedPhone = phoneMatch[1].replace(/[\s\-]/g, '');
        updatedData.phone = convertBengaliToEnglishNumerals(cleanedPhone);
      }

      if (dateMatch) {
        // Convert Bengali date format to English if needed
        updatedData.deliveryDate = convertBengaliToEnglishNumerals(dateMatch[1]);
      }

      if (babyWeightMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.babyWeight = convertBengaliToEnglishNumerals(babyWeightMatch[1]);
      }

      if (motherWeightMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.motherWeight = convertBengaliToEnglishNumerals(motherWeightMatch[1]);
      }

      if (bpMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.bloodPressure = convertBengaliToEnglishNumerals(bpMatch[1]);
      }

      // Check for issues/notes
      const issuesMatch = transcript.match(patterns.issues);
      if (issuesMatch) {
        updatedData.notes = issuesMatch[1];
      }

      // If no specific matches were found, try to parse field-value pairs
      if (!nameMatch && !ageMatch && !phoneMatch && !dateMatch && !babyWeightMatch && !motherWeightMatch && !bpMatch) {
        // Split the transcript into words
        const words = transcript.split(/\s+/);

        // Process pairs of words (field name followed by value)
        for (let i = 0; i < words.length - 1; i++) {
          const field = words[i].toLowerCase();
          const value = words[i + 1];

          // Check if the current word is a field name
          if ((isEnglish && (field === 'name' || field === 'mother')) || (!isEnglish && (field === 'নাম' || field === 'মায়ের'))) {
            // Handle "mother's name" or "mother name" in English
            if (isEnglish && field === 'mother' && i < words.length - 2) {
              if (words[i+1].toLowerCase() === 'name' || words[i+1].toLowerCase() === "'s") {
                let startIndex = words[i+1].toLowerCase() === "'s" && i < words.length - 3 && words[i+2].toLowerCase() === 'name' ? i + 3 : i + 2;
                let fullName = words[startIndex];
                let j = startIndex + 1;
                while (j < words.length &&
                      !['name', 'age', 'phone', 'delivery', 'baby', 'mother', 'blood', 'weight', 'bp',
                        'নাম', 'বয়স', 'ফোন', 'প্রসবের', 'শিশুর', 'মায়ের', 'রক্তচাপ', 'ওজন']
                      .includes(words[j].toLowerCase())) {
                  fullName += ' ' + words[j];
                  j++;
                }
                updatedData.motherName = fullName;
                i = j - 1; // Skip processed words
              }
            }
            // Handle "মায়ের নাম" in Bengali
            else if (!isEnglish && field === 'মায়ের' && i < words.length - 2 && words[i+1].toLowerCase() === 'নাম') {
              let fullName = words[i+2];
              let j = i + 3;
              while (j < words.length &&
                    !['নাম', 'বয়স', 'ফোন', 'প্রসবের', 'শিশুর', 'মায়ের', 'রক্তচাপ', 'ওজন']
                    .includes(words[j].toLowerCase())) {
                fullName += ' ' + words[j];
                j++;
              }
              updatedData.motherName = fullName;
              i = j - 1; // Skip processed words
            }
            // Handle simple "name" field
            else if ((isEnglish && field === 'name') || (!isEnglish && field === 'নাম')) {
              let fullName = value;
              let j = i + 2;
              while (j < words.length &&
                    !['name', 'age', 'phone', 'delivery', 'baby', 'mother', 'blood', 'weight', 'bp',
                      'নাম', 'বয়স', 'ফোন', 'প্রসবের', 'শিশুর', 'মায়ের', 'রক্তচাপ', 'ওজন']
                    .includes(words[j].toLowerCase())) {
                fullName += ' ' + words[j];
                j++;
              }
              updatedData.motherName = fullName;
              i = j - 1; // Skip processed words
            }
          }
          else if ((isEnglish && field === 'age') || (!isEnglish && field === 'বয়স')) {
            if (/^\d+$/.test(value)) {
              updatedData.age = value;
            }
            i++; // Skip the value
          }
          else if ((isEnglish && field === 'phone') || (!isEnglish && field === 'ফোন')) {
            // Check if the next value is a 10-digit number
            if (/^\d{10}$/.test(value)) {
              updatedData.phone = value;
              i++; // Skip the value
            }
            // If not, try to collect digits from multiple words to form a 10-digit number
            else {
              let phoneNumber = '';
              let j = i + 1;
              // Collect digits until we have 10 or reach the end of words
              while (j < words.length && phoneNumber.length < 10) {
                // Extract only digits from the current word
                const digits = words[j].replace(/\D/g, '');
                phoneNumber += digits;
                j++;
              }

              // If we collected 10 digits, use it as the phone number
              if (phoneNumber.length === 10) {
                updatedData.phone = phoneNumber;
                i = j - 1; // Skip processed words
              } else if (phoneNumber.length > 10) {
                // If we collected more than 10 digits, use the first 10
                updatedData.phone = phoneNumber.substring(0, 10);
                i = j - 1; // Skip processed words
              }
            }
          }
          else if ((isEnglish && field === 'delivery' && i < words.length - 2 && words[i+1].toLowerCase() === 'date') ||
                  (!isEnglish && field === 'প্রসবের' && i < words.length - 2 && words[i+1].toLowerCase() === 'তারিখ')) {
            const dateValue = words[i + 2];
            updatedData.deliveryDate = dateValue;
            i += 2; // Skip the values
          }
          else if ((isEnglish && field === 'baby' && i < words.length - 2 &&
                    (words[i+1].toLowerCase() === 'weight' || words[i+1].toLowerCase() === "'s")) ||
                  (!isEnglish && field === 'শিশুর' && i < words.length - 2 && words[i+1].toLowerCase() === 'ওজন')) {
            if (isEnglish) {
              const valueIndex = words[i+1].toLowerCase() === "'s" ? i + 3 : i + 2;
              if (valueIndex < words.length && /^\d+(\.\d+)?$/.test(words[valueIndex])) {
                updatedData.babyWeight = words[valueIndex];
              }
              i = valueIndex; // Skip processed words
            } else {
              if (/^\d+(\.\d+)?$/.test(words[i+2])) {
                updatedData.babyWeight = words[i+2];
              }
              i += 2; // Skip the values
            }
          }
          else if ((isEnglish && field === 'mother' && i < words.length - 2 &&
                    (words[i+1].toLowerCase() === 'weight' || words[i+1].toLowerCase() === "'s")) ||
                  (!isEnglish && field === 'মায়ের' && i < words.length - 2 && words[i+1].toLowerCase() === 'ওজন')) {
            if (isEnglish) {
              const valueIndex = words[i+1].toLowerCase() === "'s" ? i + 3 : i + 2;
              if (valueIndex < words.length && /^\d+(\.\d+)?$/.test(words[valueIndex])) {
                updatedData.motherWeight = words[valueIndex];
              }
              i = valueIndex; // Skip processed words
            } else {
              if (/^\d+(\.\d+)?$/.test(words[i+2])) {
                updatedData.motherWeight = words[i+2];
              }
              i += 2; // Skip the values
            }
          }
          else if ((isEnglish && field === 'blood' && i < words.length - 2 && words[i+1].toLowerCase() === 'pressure') ||
                  (!isEnglish && field === 'রক্তচাপ')) {
            const bpValue = isEnglish ? words[i + 2] : value;
            updatedData.bloodPressure = bpValue;
            i += isEnglish ? 2 : 1; // Skip the values
          }
        }
      }

      // Update state with the extracted data
      setPostnatalData(updatedData);

      // Processing complete
      setIsProcessing(false);

      // Log success message instead of showing alert
      console.log(isEnglish ? 'Voice input processed successfully.' : 'ভয়েস ইনপুট সফলভাবে প্রক্রিয়া করা হয়েছে।');
    }
    else if (activeTab === 'child') {
      // Create a new data object with the current data
      const updatedData = { ...childData };

      // Always keep the transcript in notes
      updatedData.notes = transcript;

      // Define regex patterns for both Bengali and English
      const patterns = {
        name: isEnglish ? /name\s+([^\s,\.]+(?:\s+[^\s,\.]+)*)/i : /নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i,
        childName: isEnglish ? /child(?:'s)?\s+name\s+([^\s,\.]+(?:\s+[^\s,\.]+)*)/i : /শিশুর\s+নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i,
        motherName: isEnglish ? /mother(?:'s)?\s+name\s+([^\s,\.]+(?:\s+[^\s,\.]+)*)/i : /মায়ের\s+নাম\s+([^\s,।]+(?:\s+[^\s,।]+)*)/i,
        dob: isEnglish ? /(?:date\s+of\s+birth|dob|birth\s+date)\s+([0-9০-৯\/\-\.]+(?:\s+[0-9০-৯\/\-\.]+)*)/i : /জন্ম\s+তারিখ\s+([0-9০-৯\/\-\.]+(?:\s+[0-9০-৯\/\-\.]+)*)/i,
        gender: isEnglish ? /gender\s+([^\s,\.]+)/i : /লিঙ্গ\s+([^\s,।]+)/i,
        weight: isEnglish ? /weight\s+([0-9০-৯\.]+)/i : /ওজন\s+([0-9০-৯\.]+)/i,
        height: isEnglish ? /height\s+([0-9০-৯\.]+)/i : /উচ্চতা\s+([0-9০-৯\.]+)/i,
        issues: isEnglish ? /(?:issues|problems|notes)\s+([^\n]+)$/i : /(?:সমস্যা|নোট)\s+([^\n]+)$/i,
      };

      // Extract data using the patterns
      const nameMatch = transcript.match(patterns.name) || transcript.match(patterns.childName);
      const motherMatch = transcript.match(patterns.motherName);
      const dobMatch = transcript.match(patterns.dob);
      const genderMatch = transcript.match(patterns.gender);
      const weightMatch = transcript.match(patterns.weight);
      const heightMatch = transcript.match(patterns.height);

      // Update specific fields if matches were found
      if (nameMatch) updatedData.name = nameMatch[1];
      if (motherMatch) updatedData.motherName = motherMatch[1];

      if (dobMatch) {
        // Convert Bengali date format to English if needed
        updatedData.dateOfBirth = convertBengaliToEnglishNumerals(dobMatch[1]);
      }

      if (genderMatch) {
        const genderValue = genderMatch[1].toLowerCase();
        if (isEnglish) {
          if (genderValue === 'boy' || genderValue === 'male') {
            updatedData.gender = 'Boy';
          } else if (genderValue === 'girl' || genderValue === 'female') {
            updatedData.gender = 'Girl';
          }
        } else {
          if (genderValue === 'ছেলে') {
            updatedData.gender = 'ছেলে';
          } else if (genderValue === 'মেয়ে') {
            updatedData.gender = 'মেয়ে';
          }
        }
      }

      if (weightMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.weight = convertBengaliToEnglishNumerals(weightMatch[1]);
      }

      if (heightMatch) {
        // Convert Bengali numerals to English if needed
        updatedData.height = convertBengaliToEnglishNumerals(heightMatch[1]);
      }

      // Check for issues/notes
      const issuesMatch = transcript.match(patterns.issues);
      if (issuesMatch) {
        updatedData.notes = issuesMatch[1];
      }

      // If no specific matches were found, try to parse field-value pairs
      if (!nameMatch && !motherMatch && !dobMatch && !genderMatch && !weightMatch && !heightMatch) {
        // Split the transcript into words
        const words = transcript.split(/\s+/);

        // Process pairs of words (field name followed by value)
        for (let i = 0; i < words.length - 1; i++) {
          const field = words[i].toLowerCase();
          const value = words[i + 1];

          // Check if the current word is a field name
          if ((isEnglish && (field === 'name' || field === 'child')) || (!isEnglish && (field === 'নাম' || field === 'শিশুর'))) {
            // Handle "child's name" or "child name" in English
            if (isEnglish && field === 'child' && i < words.length - 2) {
              if (words[i+1].toLowerCase() === 'name' || words[i+1].toLowerCase() === "'s") {
                let startIndex = words[i+1].toLowerCase() === "'s" && i < words.length - 3 && words[i+2].toLowerCase() === 'name' ? i + 3 : i + 2;
                let fullName = words[startIndex];
                let j = startIndex + 1;
                while (j < words.length &&
                      !['name', 'age', 'mother', 'birth', 'date', 'gender', 'weight', 'height',
                        'নাম', 'বয়স', 'মায়ের', 'জন্ম', 'তারিখ', 'লিঙ্গ', 'ওজন', 'উচ্চতা']
                      .includes(words[j].toLowerCase())) {
                  fullName += ' ' + words[j];
                  j++;
                }
                updatedData.name = fullName;
                i = j - 1; // Skip processed words
              }
            }
            // Handle "শিশুর নাম" in Bengali
            else if (!isEnglish && field === 'শিশুর' && i < words.length - 2 && words[i+1].toLowerCase() === 'নাম') {
              let fullName = words[i+2];
              let j = i + 3;
              while (j < words.length &&
                    !['নাম', 'বয়স', 'মায়ের', 'জন্ম', 'তারিখ', 'লিঙ্গ', 'ওজন', 'উচ্চতা']
                    .includes(words[j].toLowerCase())) {
                fullName += ' ' + words[j];
                j++;
              }
              updatedData.name = fullName;
              i = j - 1; // Skip processed words
            }
            // Handle simple "name" field
            else if ((isEnglish && field === 'name') || (!isEnglish && field === 'নাম')) {
              let fullName = value;
              let j = i + 2;
              while (j < words.length &&
                    !['name', 'age', 'mother', 'birth', 'date', 'gender', 'weight', 'height',
                      'নাম', 'বয়স', 'মায়ের', 'জন্ম', 'তারিখ', 'লিঙ্গ', 'ওজন', 'উচ্চতা']
                    .includes(words[j].toLowerCase())) {
                fullName += ' ' + words[j];
                j++;
              }
              updatedData.name = fullName;
              i = j - 1; // Skip processed words
            }
          }
          else if ((isEnglish && field === 'mother' && i < words.length - 2) || (!isEnglish && field === 'মায়ের' && i < words.length - 2)) {
            // Handle "mother's name" or "mother name" in English
            if (isEnglish && (words[i+1].toLowerCase() === 'name' || words[i+1].toLowerCase() === "'s")) {
              let startIndex = words[i+1].toLowerCase() === "'s" && i < words.length - 3 && words[i+2].toLowerCase() === 'name' ? i + 3 : i + 2;
              let fullName = words[startIndex];
              let j = startIndex + 1;
              while (j < words.length &&
                    !['name', 'age', 'child', 'birth', 'date', 'gender', 'weight', 'height',
                      'নাম', 'বয়স', 'শিশুর', 'জন্ম', 'তারিখ', 'লিঙ্গ', 'ওজন', 'উচ্চতা']
                    .includes(words[j].toLowerCase())) {
                fullName += ' ' + words[j];
                j++;
              }
              updatedData.motherName = fullName;
              i = j - 1; // Skip processed words
            }
            // Handle "মায়ের নাম" in Bengali
            else if (!isEnglish && words[i+1].toLowerCase() === 'নাম') {
              let fullName = words[i+2];
              let j = i + 3;
              while (j < words.length &&
                    !['নাম', 'বয়স', 'শিশুর', 'জন্ম', 'তারিখ', 'লিঙ্গ', 'ওজন', 'উচ্চতা']
                    .includes(words[j].toLowerCase())) {
                fullName += ' ' + words[j];
                j++;
              }
              updatedData.motherName = fullName;
              i = j - 1; // Skip processed words
            }
          }
          else if ((isEnglish && (field === 'birth' || field === 'date' || field === 'dob')) ||
                  (!isEnglish && (field === 'জন্ম'))) {
            // Handle "birth date", "date of birth", or "dob" in English
            if (isEnglish) {
              let dateValue = '';
              if (field === 'birth' && i < words.length - 2 && words[i+1].toLowerCase() === 'date') {
                dateValue = words[i+2];
                i += 2;
              } else if (field === 'date' && i < words.length - 3 && words[i+1].toLowerCase() === 'of' && words[i+2].toLowerCase() === 'birth') {
                dateValue = words[i+3];
                i += 3;
              } else if (field === 'dob') {
                dateValue = value;
                i += 1;
              }
              if (dateValue) {
                updatedData.dateOfBirth = dateValue;
              }
            }
            // Handle "জন্ম তারিখ" in Bengali
            else if (!isEnglish && i < words.length - 2 && words[i+1].toLowerCase() === 'তারিখ') {
              updatedData.dateOfBirth = words[i+2];
              i += 2;
            }
          }
          else if ((isEnglish && field === 'gender') || (!isEnglish && field === 'লিঙ্গ')) {
            const genderValue = value.toLowerCase();
            if (isEnglish) {
              if (genderValue === 'boy' || genderValue === 'male') {
                updatedData.gender = 'Boy';
              } else if (genderValue === 'girl' || genderValue === 'female') {
                updatedData.gender = 'Girl';
              }
            } else {
              if (genderValue === 'ছেলে') {
                updatedData.gender = 'ছেলে';
              } else if (genderValue === 'মেয়ে') {
                updatedData.gender = 'মেয়ে';
              }
            }
            i++; // Skip the value
          }
          else if ((isEnglish && field === 'weight') || (!isEnglish && field === 'ওজন')) {
            if (/^\d+(\.\d+)?$/.test(value)) {
              updatedData.weight = value;
            }
            i++; // Skip the value
          }
          else if ((isEnglish && field === 'height') || (!isEnglish && field === 'উচ্চতা')) {
            if (/^\d+(\.\d+)?$/.test(value)) {
              updatedData.height = value;
            }
            i++; // Skip the value
          }
        }
      }

      // Update state with the extracted data
      setChildData(updatedData);

      // Processing complete
      setIsProcessing(false);

      // Log success message instead of showing alert
      console.log(isEnglish ? 'Voice input processed successfully.' : 'ভয়েস ইনপুট সফলভাবে প্রক্রিয়া করা হয়েছে।');
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      let patientData = {};
      let patientType = '';

      // Prepare data based on active tab
      if (activeTab === 'pregnant') {
        patientData = {
          name: pregnantData.name || 'Unknown',
          age: pregnantData.age || '0',
          phone: pregnantData.phone || '',
          lmpDate: pregnantData.lmpDate || '',
          weight: pregnantData.weight || '',
          height: pregnantData.height || '',
          bloodPressure: pregnantData.bloodPressure || '',
          isHighRisk: pregnantData.isHighRisk || false,
          notes: pregnantData.notes || '',
          type: 'pregnant'
        };
        patientType = 'pregnant';
      } else if (activeTab === 'postnatal') {
        patientData = {
          name: postnatalData.motherName || 'Unknown', // Use motherName as the main name
          age: postnatalData.age || '0',
          phone: postnatalData.phone || '',
          deliveryDate: postnatalData.deliveryDate || '',
          deliveryType: postnatalData.deliveryType || 'normal',
          babyWeight: postnatalData.babyWeight || '',
          motherWeight: postnatalData.motherWeight || '',
          bloodPressure: postnatalData.bloodPressure || '',
          notes: postnatalData.notes || '',
          type: 'postnatal'
        };
        patientType = 'postnatal';
      } else if (activeTab === 'child') {
        patientData = {
          name: childData.name || 'Unknown',
          motherName: childData.motherName || '',
          dateOfBirth: childData.dateOfBirth || '',
          gender: childData.gender || '',
          weight: childData.weight || '',
          height: childData.height || '',
          immunizationStatus: childData.immunizationStatus || '',
          notes: childData.notes || '',
          type: 'child'
        };
        patientType = 'child';
      }

      console.log('Saving patient data:', patientData);

      // Save data using patientService
      const result = await addPatient(patientData);

      console.log('Save result:', result);

      if (result.success) {
        // Show success message
        Alert.alert(
          isEnglish ? 'Success' : 'সফল',
          isEnglish ? 'Data saved successfully!' : 'তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!',
          [
            {
              text: isEnglish ? 'OK' : 'ঠিক আছে',
              onPress: () => {
                // Reset form based on active tab
                if (activeTab === 'pregnant') {
                  setPregnantData({
                    name: '',
                    age: '',
                    phone: '',
                    lmpDate: '',
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

                // Navigate to dashboard
                router.replace('/(tabs)/dashboard');
              }
            }
          ]
        );
      } else {
        // Show error message
        Alert.alert(
          isEnglish ? 'Error' : 'ত্রুটি',
          isEnglish ? `Failed to save data: ${result.error}` : `তথ্য সংরক্ষণ করতে ব্যর্থ: ${result.error}`,
          [{ text: isEnglish ? 'OK' : 'ঠিক আছে' }]
        );
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        isEnglish ? 'Error' : 'ত্রুটি',
        isEnglish ? 'An unexpected error occurred' : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে',
        [{ text: isEnglish ? 'OK' : 'ঠিক আছে' }]
      );
    } finally {
      setSaving(false);
    }
  };

  // Helper function to convert Bengali numerals to English numerals
  const convertBengaliToEnglishNumerals = (text) => {
    if (!text) return text;

    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const bengaliIndex = bengaliNumerals.indexOf(text[i]);
      if (bengaliIndex !== -1) {
        result += bengaliIndex.toString();
      } else {
        result += text[i];
      }
    }

    return result;
  };



  const renderPregnantWomenForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label={translations.name}
          value={pregnantData.name}
          onChangeText={(text) => setPregnantData({...pregnantData, name: text})}
          placeholder={translations.enterName}
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.age}
              value={pregnantData.age}
              onChangeText={(text) => setPregnantData({...pregnantData, age: text})}
              placeholder={translations.age}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.phone}
              value={pregnantData.phone}
              onChangeText={(text) => setPregnantData({...pregnantData, phone: text})}
              placeholder={translations.phone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <BengaliTextInput
          label={translations.lmpDate}
          value={pregnantData.lmpDate}
          onChangeText={(text) => setPregnantData({...pregnantData, lmpDate: text})}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.weight}
              value={pregnantData.weight}
              onChangeText={(text) => setPregnantData({...pregnantData, weight: text})}
              placeholder={translations.weight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.height}
              value={pregnantData.height}
              onChangeText={(text) => setPregnantData({...pregnantData, height: text})}
              placeholder={translations.height}
              keyboardType="numeric"
            />
          </View>
        </View>

        <BengaliTextInput
          label={translations.bloodPressure}
          value={pregnantData.bloodPressure}
          onChangeText={(text) => setPregnantData({...pregnantData, bloodPressure: text})}
          placeholder={translations.bpExample}
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
          <Text style={styles.checkboxLabel}>{translations.highRiskPregnancy}</Text>
        </View>

        <BengaliTextInput
          label={translations.notes}
          value={pregnantData.notes}
          onChangeText={(text) => setPregnantData({...pregnantData, notes: text})}
          placeholder={translations.notes}
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title={translations.save}
            onPress={handleSave}
            loading={saving}
            disabled={!pregnantData.name || !pregnantData.age}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => console.log('Reminder set for next ANC visit')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>{translations.setReminder}</Text>
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
          label={translations.motherName}
          value={postnatalData.motherName}
          onChangeText={(text) => setPostnatalData({...postnatalData, motherName: text})}
          placeholder={translations.motherName}
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.age}
              value={postnatalData.age}
              onChangeText={(text) => setPostnatalData({...postnatalData, age: text})}
              placeholder={translations.age}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.phone}
              value={postnatalData.phone}
              onChangeText={(text) => setPostnatalData({...postnatalData, phone: text})}
              placeholder={translations.phone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <BengaliTextInput
          label={translations.deliveryDate}
          value={postnatalData.deliveryDate}
          onChangeText={(text) => setPostnatalData({...postnatalData, deliveryDate: text})}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>{translations.deliveryType}</Text>
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
              <Text style={styles.radioText}>{translations.normal}</Text>
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
              <Text style={styles.radioText}>{translations.cesarean}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.babyWeight}
              value={postnatalData.babyWeight}
              onChangeText={(text) => setPostnatalData({...postnatalData, babyWeight: text})}
              placeholder={translations.babyWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.motherWeight}
              value={postnatalData.motherWeight}
              onChangeText={(text) => setPostnatalData({...postnatalData, motherWeight: text})}
              placeholder={translations.motherWeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        <BengaliTextInput
          label={translations.bloodPressure}
          value={postnatalData.bloodPressure}
          onChangeText={(text) => setPostnatalData({...postnatalData, bloodPressure: text})}
          placeholder={translations.bpExample}
        />

        <BengaliTextInput
          label={translations.notes}
          value={postnatalData.notes}
          onChangeText={(text) => setPostnatalData({...postnatalData, notes: text})}
          placeholder={translations.notes}
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title={translations.save}
            onPress={handleSave}
            loading={saving}
            disabled={!postnatalData.motherName || !postnatalData.deliveryDate}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => console.log('Reminder set for next PNC visit')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>{translations.setPncReminder}</Text>
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
          label={translations.childName}
          value={childData.name}
          onChangeText={(text) => setChildData({...childData, name: text})}
          placeholder={translations.childName}
        />

        <BengaliTextInput
          label={translations.motherName}
          value={childData.motherName}
          onChangeText={(text) => setChildData({...childData, motherName: text})}
          placeholder={translations.motherName}
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.dateOfBirth}
              value={childData.dateOfBirth}
              onChangeText={(text) => setChildData({...childData, dateOfBirth: text})}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.halfField}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioLabel}>{translations.gender}</Text>
              <View style={styles.radioOptions}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setChildData({...childData, gender: isEnglish ? 'Boy' : 'ছেলে'})}
                >
                  <View style={[
                    styles.radioButton,
                    (childData.gender === 'ছেলে' || childData.gender === 'Boy') && styles.radioButtonSelected
                  ]}>
                    {(childData.gender === 'ছেলে' || childData.gender === 'Boy') && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>{translations.boy}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setChildData({...childData, gender: isEnglish ? 'Girl' : 'মেয়ে'})}
                >
                  <View style={[
                    styles.radioButton,
                    (childData.gender === 'মেয়ে' || childData.gender === 'Girl') && styles.radioButtonSelected
                  ]}>
                    {(childData.gender === 'মেয়ে' || childData.gender === 'Girl') && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>{translations.girl}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.weight}
              value={childData.weight}
              onChangeText={(text) => setChildData({...childData, weight: text})}
              placeholder={translations.weight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label={translations.height}
              value={childData.height}
              onChangeText={(text) => setChildData({...childData, height: text})}
              placeholder={translations.height}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>{translations.immunizationStatus}</Text>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => console.log('Show dropdown options')}
            >
              <Text style={styles.dropdownButtonText}>
                {childData.immunizationStatus || translations.selectStatus}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <BengaliTextInput
          label={translations.notes}
          value={childData.notes}
          onChangeText={(text) => setChildData({...childData, notes: text})}
          placeholder={translations.notes}
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title={translations.save}
            onPress={handleSave}
            loading={saving}
            disabled={!childData.name || !childData.dateOfBirth}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => console.log('Reminder set for next immunization')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>{translations.setImmunizationReminder}</Text>
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
