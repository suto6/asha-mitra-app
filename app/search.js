import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import PatientCard from '@/components/PatientCard';
import BottomNavBar from '@/components/BottomNavBar';
import VoiceInputButton from '@/components/VoiceInputButton';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name', 'phone', 'id'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isEnglish } = useLanguage();

  // Text translations
  const translations = {
    searchByName: isEnglish ? 'Search by Name' : BengaliText.SEARCH_BY_NAME,
    name: isEnglish ? 'Name' : 'নাম',
    phone: isEnglish ? 'Phone' : 'ফোন',
    id: isEnglish ? 'ID' : 'আইডি',
    searchByNamePlaceholder: isEnglish ? 'Search by name' : 'নাম দিয়ে খুঁজুন',
    searchByPhonePlaceholder: isEnglish ? 'Search by phone number' : 'ফোন নম্বর দিয়ে খুঁজুন',
    searchByIdPlaceholder: isEnglish ? 'Search by ID' : 'আইডি দিয়ে খুঁজুন',
    searchPatient: isEnglish ? 'Search Patient' : BengaliText.SEARCH_PATIENT,
    listening: isEnglish ? 'Listening' : BengaliText.LISTENING,
    processing: isEnglish ? 'Processing' : BengaliText.PROCESSING,
    all: isEnglish ? 'All' : 'সব',
    pregnant: isEnglish ? 'Pregnant' : BengaliText.PREGNANT,
    newborn: isEnglish ? 'Newborn' : BengaliText.NEWBORN,
    child: isEnglish ? 'Child' : BengaliText.CHILD,
    patientsFound: isEnglish ? 'patients found' : 'জন পেশেন্ট পাওয়া গেছে',
    noSearchResults: isEnglish ? 'No search results found' : BengaliText.NO_SEARCH_RESULTS,
    recentPatients: isEnglish ? 'Recent Patients' : BengaliText.RECENT_PATIENTS,
    noRecentPatients: isEnglish ? 'No recent patients' : BengaliText.NO_RECENT_PATIENTS,
  };

  useEffect(() => {
    // In a real implementation, we would fetch recent patients from a database
    // For demo purposes, we're using placeholder data
    const mockRecentPatients = [
      {
        id: '1',
        name: 'পিঙ্কি বিশ্বাস',
        age: '25',
        type: 'pregnant',
        lastVisit: '২০২৩-০৫-১০',
        lmpDate: '২০২৩-০৪-০১',
      },
      {
        id: '2',
        name: 'সুমিতা রায়',
        age: '22',
        type: 'pregnant',
        lastVisit: '২০২৩-০৫-০৮',
        lmpDate: '২০২৩-০৩-১৫',
      },
      {
        id: '3',
        name: 'অনিতা দাস',
        age: '0',
        type: 'newborn',
        lastVisit: '২০২৩-০৫-১২',
        birthDate: '২০২৩-০৫-০১',
      },
      {
        id: '4',
        name: 'রাজু সিং',
        age: '3',
        type: 'child',
        lastVisit: '২০২৩-০৫-০৫',
        birthDate: '২০২০-০২-১০',
      },
    ];

    setRecentPatients(mockRecentPatients);
  }, []);

  const handleSearch = () => {
    if (!searchQuery) return;

    setSearching(true);

    // Simulate search delay
    setTimeout(() => {
      // In a real app, this would search a database
      const results = recentPatients.filter(patient => {
        if (searchType === 'name') {
          return patient.name.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === 'phone') {
          return patient.phone && patient.phone.includes(searchQuery);
        } else if (searchType === 'id') {
          return patient.id.includes(searchQuery);
        }
        return false;
      });

      setSearchResults(results);
      setSearching(false);
    }, 1000);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleStartRecording = () => {
    setIsRecording(true);

    // Simulate voice recognition
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);

      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setSearchQuery('পিঙ্কি');
        handleSearch();
      }, 1500);
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSelectPatient = (patientId) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  const filteredResults = activeFilter === 'all'
    ? searchResults
    : searchResults.filter(patient => patient.type === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{translations.searchByName}</Text>
            <LanguageToggle style={styles.languageToggle} />
          </View>
        </View>

        {/* Search Type Selector */}
        <View style={styles.searchTypeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'name' && styles.activeSearchTypeButton
              ]}
              onPress={() => setSearchType('name')}
            >
              <Ionicons
                name="person"
                size={20}
                color={searchType === 'name' ? '#FFFFFF' : '#666666'}
              />
              <Text style={[
                styles.searchTypeText,
                searchType === 'name' && styles.activeSearchTypeText
              ]}>
                {translations.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'phone' && styles.activeSearchTypeButton
              ]}
              onPress={() => setSearchType('phone')}
            >
              <Ionicons
                name="call"
                size={20}
                color={searchType === 'phone' ? '#FFFFFF' : '#666666'}
              />
              <Text style={[
                styles.searchTypeText,
                searchType === 'phone' && styles.activeSearchTypeText
              ]}>
                {translations.phone}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.searchTypeButton,
                searchType === 'id' && styles.activeSearchTypeButton
              ]}
              onPress={() => setSearchType('id')}
            >
              <Ionicons
                name="card"
                size={20}
                color={searchType === 'id' ? '#FFFFFF' : '#666666'}
              />
              <Text style={[
                styles.searchTypeText,
                searchType === 'id' && styles.activeSearchTypeText
              ]}>
                {translations.id}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
              <BengaliTextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={
                  searchType === 'name' ? translations.searchByNamePlaceholder :
                  searchType === 'phone' ? translations.searchByPhonePlaceholder :
                  translations.searchByIdPlaceholder
                }
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
                title={translations.searchPatient}
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
              <Text style={styles.recordingText}>{translations.listening}...</Text>
              <View style={styles.pulsatingDot} />
            </View>
          )}

          {isProcessing && (
            <View style={styles.processingIndicator}>
              <Text style={styles.processingText}>{translations.processing}...</Text>
            </View>
          )}
        </View>

        {/* Results Filter Tabs (only show when there are results) */}
        {searchResults.length > 0 && (
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
                  {translations.all}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'pregnant' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('pregnant')}
              >
                <Text style={[styles.filterText, activeFilter === 'pregnant' && styles.activeFilterText]}>
                  {translations.pregnant}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'newborn' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('newborn')}
              >
                <Text style={[styles.filterText, activeFilter === 'newborn' && styles.activeFilterText]}>
                  {translations.newborn}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'child' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('child')}
              >
                <Text style={[styles.filterText, activeFilter === 'child' && styles.activeFilterText]}>
                  {translations.child}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Search Results or Recent Patients */}
        <View style={styles.resultsContainer}>
          {searchQuery && !searching ? (
            <>
              <Text style={styles.resultsTitle}>
                {filteredResults.length > 0
                  ? `${filteredResults.length} ${translations.patientsFound}`
                  : translations.noSearchResults}
              </Text>

              {filteredResults.length > 0 ? (
                <FlatList
                  data={filteredResults}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <PatientCard
                      patient={item}
                      onPress={() => handleSelectPatient(item.id)}
                    />
                  )}
                  contentContainerStyle={styles.resultsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyResultsContainer}>
                  <Ionicons name="search" size={64} color="#CCCCCC" />
                  <Text style={styles.emptyResultsText}>
                    {translations.noSearchResults}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={styles.resultsTitle}>
                {translations.recentPatients}
              </Text>

              {recentPatients.length > 0 ? (
                <FlatList
                  data={recentPatients}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <PatientCard
                      patient={item}
                      onPress={() => handleSelectPatient(item.id)}
                    />
                  )}
                  contentContainerStyle={styles.resultsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyResultsContainer}>
                  <Ionicons name="people" size={64} color="#CCCCCC" />
                  <Text style={styles.emptyResultsText}>
                    {translations.noRecentPatients}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>

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
    paddingBottom: 90, // Space for bottom nav
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
  searchTypeContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeSearchTypeButton: {
    backgroundColor: '#4A90E2',
  },
  searchTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginLeft: 6,
  },
  activeSearchTypeText: {
    color: '#FFFFFF',
  },
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterScroll: {
    paddingVertical: 10,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterTab: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
});
