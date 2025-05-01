import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import VoiceInputButton from '@/components/VoiceInputButton';
import PatientCard from '@/components/PatientCard';
import { startVoiceRecognition, speakBengali } from '@/utils/voiceRecognition';
import { searchPatientsByName } from '@/services/firebaseService';

export default function SearchPatientScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Function to handle starting voice recording for search
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
      const simulatedVoiceInput = "পিঙ্কি বিশ্বাস";
      
      setSearchQuery(simulatedVoiceInput);
      setIsProcessing(false);
      
      // Automatically search after voice input
      handleSearch(simulatedVoiceInput);
    }, 1500);
  };

  // Function to handle search
  const handleSearch = async (query = searchQuery) => {
    if (!query) {
      Alert.alert(BengaliText.ERROR, BengaliText.REQUIRED_FIELD);
      return;
    }
    
    setSearching(true);
    
    try {
      // In a real implementation, we would search the database
      // For demo purposes, we're using simulated results
      
      // Simulate search results
      setTimeout(() => {
        const simulatedResults = [
          {
            id: '1',
            name: 'পিঙ্কি বিশ্বাস',
            age: '25',
            lmpDate: '২০২৩-০৪-০১',
          },
          {
            id: '2',
            name: 'পিঙ্কি দাস',
            age: '30',
            lmpDate: '২০২৩-০৩-১৫',
          },
        ];
        
        setSearchResults(simulatedResults);
        setSearching(false);
      }, 1000);
      
    } catch (error) {
      Alert.alert(BengaliText.ERROR, error.message);
      setSearching(false);
    }
  };

  // Function to navigate to patient details
  const handleSelectPatient = (patient) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patient.id }
    });
  };

  // Function to clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{BengaliText.SEARCH_PATIENT}</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <BengaliTextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={BengaliText.PATIENT_NAME}
              style={styles.searchInput}
            />
            {searchQuery ? (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearSearch}
              >
                <Ionicons name="close-circle" size={24} color="#999999" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <View style={styles.searchButtonsContainer}>
            <BengaliButton
              title={BengaliText.SEARCH_PATIENT}
              onPress={() => handleSearch()}
              loading={searching}
              disabled={!searchQuery}
              style={styles.searchButton}
            />
            
            <VoiceInputButton
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              isRecording={isRecording}
              isProcessing={isProcessing}
              style={styles.voiceButton}
            />
          </View>
        </View>

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PatientCard
                  patient={item}
                  onPress={() => handleSelectPatient(item)}
                />
              )}
              contentContainerStyle={styles.resultsList}
            />
          ) : (
            searchQuery && !searching && (
              <View style={styles.emptyResultsContainer}>
                <Ionicons name="search" size={48} color="#CCCCCC" />
                <Text style={styles.emptyResultsText}>
                  কোন ফলাফল পাওয়া যায়নি
                </Text>
              </View>
            )
          )}
        </View>
      </View>
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
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  searchButtonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  searchButton: {
    flex: 1,
    marginRight: 8,
  },
  voiceButton: {
    height: 60,
    minHeight: 60,
    width: 60,
    minWidth: 60,
    borderRadius: 30,
    padding: 0,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    paddingBottom: 20,
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
  },
});
