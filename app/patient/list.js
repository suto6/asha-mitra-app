import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import PatientCard from '@/components/PatientCard';

export default function PatientListScreen() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // In a real implementation, we would fetch patients from a database
    // For demo purposes, we're using placeholder data
    const mockPatients = [
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
    
    setPatients(mockPatients);
    setLoading(false);
  }, []);

  const handleSelectPatient = (patientId) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  const filteredPatients = patients.filter(patient => {
    if (activeFilter === 'all') return true;
    return patient.type === activeFilter;
  });

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
            <Text style={styles.title}>{BengaliText.VIEW_ALL_PATIENTS}</Text>
            <View style={styles.placeholderView} />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
                সব
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'pregnant' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('pregnant')}
            >
              <Text style={[styles.filterText, activeFilter === 'pregnant' && styles.activeFilterText]}>
                {BengaliText.PREGNANT}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'newborn' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('newborn')}
            >
              <Text style={[styles.filterText, activeFilter === 'newborn' && styles.activeFilterText]}>
                {BengaliText.NEWBORN}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'child' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('child')}
            >
              <Text style={[styles.filterText, activeFilter === 'child' && styles.activeFilterText]}>
                {BengaliText.CHILD}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Patient List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {filteredPatients.length} জন রোগী পাওয়া গেছে
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
            </View>
          ) : filteredPatients.length > 0 ? (
            <FlatList
              data={filteredPatients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PatientCard
                  patient={item}
                  onPress={() => handleSelectPatient(item.id)}
                />
              )}
              contentContainerStyle={styles.patientList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={64} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                কোন রোগী পাওয়া যায়নি
              </Text>
            </View>
          )}
        </View>
        
        {/* Add Patient Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/add-patient')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
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
  
  // Filter Styles
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  
  // List Styles
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  patientList: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
    textAlign: 'center',
  },
  
  // Add Button
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
