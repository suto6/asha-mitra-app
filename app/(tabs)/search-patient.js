import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import VoiceInputButton from '@/components/VoiceInputButton';
import PatientCard from '@/components/PatientCard';
import { startVoiceRecognition, speakBengali } from '@/utils/voiceRecognition';
import { searchPatientsByName } from '@/services/patientService';

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
      console.log(BengaliText.ERROR, BengaliText.REQUIRED_FIELD);
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
      console.log(BengaliText.ERROR, error.message);
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
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>{BengaliText.SEARCH_PATIENT}</Text>
            <View style={styles.placeholderView} />
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
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

              <TouchableOpacity
                style={styles.voiceSearchButton}
                onPress={handleStartRecording}
                disabled={isRecording || isProcessing}
              >
                <Ionicons
                  name={isRecording ? "mic" : "mic-outline"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Text style={styles.recordingText}>{BengaliText.LISTENING}...</Text>
              <View style={styles.pulsatingDot} />
            </View>
          )}

          {isProcessing && (
            <View style={styles.processingIndicator}>
              <Text style={styles.processingText}>{BengaliText.PROCESSING}...</Text>
            </View>
          )}
        </View>

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchResults.length > 0
                ? `${searchResults.length} জন পেশেন্ট পাওয়া গেছে`
                : searchQuery && !searching ? BengaliText.NO_SEARCH_RESULTS : 'পেশেন্ট খুঁজুন'}
            </Text>
          </View>

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
              showsVerticalScrollIndicator={false}
            />
          ) : (
            searchQuery && !searching ? (
              <View style={styles.emptyResultsContainer}>
                <Ionicons name="search" size={64} color="#CCCCCC" />
                <Text style={styles.emptyResultsText}>
                  {BengaliText.NO_SEARCH_RESULTS}
                </Text>
              </View>
            ) : (
              <View style={styles.initialStateContainer}>
                <Ionicons name="people" size={64} color="#CCCCCC" />
                <Text style={styles.initialStateText}>
                  পেশেন্টের নাম লিখুন বা ভয়েস দিয়ে খুঁজুন
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

  // Search Section Styles
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 50,
  },
  clearButton: {
    padding: 4,
  },
  searchButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    flex: 1,
    marginRight: 12,
  },
  voiceSearchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  recordingText: {
    fontSize: 16,
    color: '#FF3B30',
    marginRight: 8,
  },
  pulsatingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
  },
  processingIndicator: {
    alignItems: 'center',
    marginTop: 12,
  },
  processingText: {
    fontSize: 16,
    color: '#4A90E2',
  },

  // Results Styles
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  resultsList: {
    paddingBottom: 20,
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyResultsText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
    textAlign: 'center',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  initialStateText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
