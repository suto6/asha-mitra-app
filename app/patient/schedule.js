import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

import BengaliText from '@/constants/BengaliText';
import BengaliButton from '@/components/BengaliButton';
import BengaliTextInput from '@/components/BengaliTextInput';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchPatientsByName, addAppointment, getAppointmentsByDate } from '@/services/patientService';

export default function ScheduleScreen() {
  const { isEnglish } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    appointmentType: 'checkup',
    date: '',
    time: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);

    try {
      // Get current date if no date is selected
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedToday = `${year}-${month}-${day}`;

      if (!selectedDate) {
        setSelectedDate(formattedToday);
      }

      // Fetch appointments from the service
      const result = await getAppointmentsByDate(selectedDate || formattedToday);

      if (result.success) {
        setAppointments(result.appointments);

        // Create marked dates for the calendar
        const marked = {};
        result.appointments.forEach(appointment => {
          marked[appointment.date] = {
            marked: true,
            dotColor: appointment.appointmentType === 'anc' ? '#4A90E2' :
                      appointment.appointmentType === 'immunization' ? '#FF9500' : '#34C759',
          };
        });

        // Highlight selected date
        marked[selectedDate || formattedToday] = {
          ...marked[selectedDate || formattedToday],
          selected: true,
          selectedColor: '#4A90E2',
        };

        setMarkedDates(marked);
      } else {
        console.error('Failed to fetch appointments:', result.error);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (day) => {
    const selectedDateString = day.dateString;

    // Update selected date in marked dates
    const newMarkedDates = { ...markedDates };

    // Remove selection from previous date
    if (selectedDate && newMarkedDates[selectedDate]) {
      newMarkedDates[selectedDate] = {
        ...newMarkedDates[selectedDate],
        selected: false,
      };
    }

    // Add selection to new date
    newMarkedDates[selectedDateString] = {
      ...newMarkedDates[selectedDateString],
      selected: true,
      selectedColor: '#4A90E2',
    };

    setMarkedDates(newMarkedDates);
    setSelectedDate(selectedDateString);

    // Update appointment data with the selected date
    setAppointmentData(prev => ({
      ...prev,
      date: selectedDateString
    }));

    // Fetch appointments for the selected date
    try {
      setLoading(true);
      const result = await getAppointmentsByDate(selectedDateString);

      if (result.success) {
        setAppointments(result.appointments);
      } else {
        console.error('Failed to fetch appointments for date:', result.error);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments for date:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle patient search
  const handleSearchPatient = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setSearching(true);

    try {
      const result = await searchPatientsByName(searchQuery);

      if (result.success) {
        setSearchResults(result.patients);
      } else {
        console.error('Failed to search patients:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Function to select a patient for the appointment
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setAppointmentData(prev => ({
      ...prev,
      patientId: patient.id
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  // Function to save the appointment
  const handleSaveAppointment = async () => {
    // Validate form
    if (!appointmentData.patientId) {
      Alert.alert(
        isEnglish ? 'Error' : 'ত্রুটি',
        isEnglish ? 'Please select a patient' : 'একজন রোগী নির্বাচন করুন'
      );
      return;
    }

    if (!appointmentData.date) {
      Alert.alert(
        isEnglish ? 'Error' : 'ত্রুটি',
        isEnglish ? 'Please select a date' : 'একটি তারিখ নির্বাচন করুন'
      );
      return;
    }

    if (!appointmentData.time) {
      Alert.alert(
        isEnglish ? 'Error' : 'ত্রুটি',
        isEnglish ? 'Please enter appointment time' : 'অ্যাপয়েন্টমেন্টের সময় লিখুন'
      );
      return;
    }

    setSaving(true);

    try {
      const result = await addAppointment(appointmentData);

      if (result.success) {
        Alert.alert(
          isEnglish ? 'Success' : 'সফল',
          isEnglish ? 'Appointment added successfully' : 'অ্যাপয়েন্টমেন্ট সফলভাবে যোগ করা হয়েছে',
          [
            {
              text: isEnglish ? 'OK' : 'ঠিক আছে',
              onPress: () => {
                setModalVisible(false);
                fetchAppointments();
                resetForm();
              }
            }
          ]
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Alert.alert(
        isEnglish ? 'Error' : 'ত্রুটি',
        isEnglish ? `Failed to add appointment: ${error.message}` : `অ্যাপয়েন্টমেন্ট যোগ করতে ব্যর্থ: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setSelectedPatient(null);
    setAppointmentData({
      patientId: '',
      appointmentType: 'checkup',
      date: selectedDate,
      time: '',
      notes: '',
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSelectAppointment = (patientId) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case 'anc':
        return 'woman';
      case 'immunization':
        return 'medkit';
      case 'checkup':
        return 'fitness';
      default:
        return 'calendar';
    }
  };

  const getAppointmentTypeColor = (type) => {
    switch (type) {
      case 'anc':
        return '#4A90E2';
      case 'immunization':
        return '#FF9500';
      case 'checkup':
        return '#34C759';
      default:
        return '#888888';
    }
  };

  const filteredAppointments = appointments.filter(
    appointment => appointment.date === selectedDate
  );

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => handleSelectAppointment(item.patientId)}
      activeOpacity={0.7}
    >
      <View style={[styles.appointmentIconContainer, { backgroundColor: getAppointmentTypeColor(item.appointmentType) }]}>
        <Ionicons name={getAppointmentTypeIcon(item.appointmentType)} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.appointmentContent}>
        <Text style={styles.appointmentTime}>{item.time}</Text>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Text style={styles.appointmentNotes}>{item.notes}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with Back Button and Language Toggle */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEnglish ? 'Schedule Calendar' : BengaliText.SCHEDULE_CALENDAR}
            </Text>
            <LanguageToggle style={styles.languageToggle} />
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDateSelect}
            theme={{
              backgroundColor: '#FFFFFF',
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: '#666666',
              selectedDayBackgroundColor: '#4A90E2',
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: '#4A90E2',
              dayTextColor: '#333333',
              textDisabledColor: '#CCCCCC',
              dotColor: '#4A90E2',
              selectedDotColor: '#FFFFFF',
              arrowColor: '#4A90E2',
              monthTextColor: '#333333',
              indicatorColor: '#4A90E2',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.legendText}>
              {isEnglish ? 'ANC Visits' : BengaliText.ANC_VISITS}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
            <Text style={styles.legendText}>
              {isEnglish ? 'Immunization' : BengaliText.IMMUNIZATION}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
            <Text style={styles.legendText}>
              {isEnglish ? 'Checkup' : 'চেকআপ'}
            </Text>
          </View>
        </View>

        {/* Appointments List with Add Button */}
        <View style={styles.appointmentsContainer}>
          <View style={styles.appointmentsHeader}>
            <Text style={styles.appointmentsTitle}>
              {selectedDate
                ? isEnglish
                  ? `Appointments for ${selectedDate}`
                  : `${selectedDate} তারিখের অ্যাপয়েন্টমেন্ট`
                : isEnglish
                  ? 'Appointments'
                  : 'অ্যাপয়েন্টমেন্ট'
              }
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setAppointmentData(prev => ({
                  ...prev,
                  date: selectedDate
                }));
                setModalVisible(true);
              }}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>
                {isEnglish ? 'Loading...' : 'লোড হচ্ছে...'}
              </Text>
            </View>
          ) : filteredAppointments.length > 0 ? (
            <FlatList
              data={filteredAppointments}
              keyExtractor={(item) => item.id}
              renderItem={renderAppointmentItem}
              contentContainerStyle={styles.appointmentsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                {isEnglish
                  ? 'No appointments for this date'
                  : 'এই তারিখে কোন অ্যাপয়েন্টমেন্ট নেই'
                }
              </Text>
              <BengaliButton
                title={isEnglish ? 'Add Appointment' : 'অ্যাপয়েন্টমেন্ট যোগ করুন'}
                onPress={() => {
                  setAppointmentData(prev => ({
                    ...prev,
                    date: selectedDate
                  }));
                  setModalVisible(true);
                }}
                style={styles.addAppointmentButton}
              />
            </View>
          )}
        </View>

        {/* Add Appointment Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            resetForm();
          }}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {isEnglish ? 'Add Appointment' : 'অ্যাপয়েন্টমেন্ট যোগ করুন'}
                </Text>
                <View style={styles.placeholderView} />
              </View>

              <ScrollView style={styles.modalScrollContent}>
                {/* Patient Selection */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>
                    {isEnglish ? 'Select Patient' : 'রোগী নির্বাচন করুন'}
                  </Text>

                  {selectedPatient ? (
                    <View style={styles.selectedPatientContainer}>
                      <Text style={styles.selectedPatientName}>{selectedPatient.name}</Text>
                      <TouchableOpacity
                        style={styles.changePatientButton}
                        onPress={() => setSelectedPatient(null)}
                      >
                        <Text style={styles.changePatientButtonText}>
                          {isEnglish ? 'Change' : 'পরিবর্তন করুন'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.searchContainer}>
                        <BengaliTextInput
                          placeholder={isEnglish ? 'Search patient by name' : 'নাম দিয়ে রোগী খুঁজুন'}
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          style={styles.searchInput}
                        />
                        <TouchableOpacity
                          style={styles.searchButton}
                          onPress={handleSearchPatient}
                          disabled={searching}
                        >
                          {searching ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Ionicons name="search" size={20} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>
                      </View>

                      {searchResults.length > 0 ? (
                        <View style={styles.searchResultsContainer}>
                          <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={styles.searchResultItem}
                                onPress={() => handleSelectPatient(item)}
                              >
                                <Text style={styles.searchResultName}>{item.name}</Text>
                                <Text style={styles.searchResultDetails}>
                                  {isEnglish ? 'Age' : 'বয়স'}: {item.age}
                                </Text>
                              </TouchableOpacity>
                            )}
                            style={styles.searchResultsList}
                            nestedScrollEnabled={true}
                            maxHeight={150}
                          />
                        </View>
                      ) : searchQuery && !searching ? (
                        <Text style={styles.noResultsText}>
                          {isEnglish ? 'No patients found' : 'কোন রোগী পাওয়া যায়নি'}
                        </Text>
                      ) : null}
                    </>
                  )}
                </View>

                {/* Appointment Details */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>
                    {isEnglish ? 'Appointment Details' : 'অ্যাপয়েন্টমেন্টের বিবরণ'}
                  </Text>

                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>
                      {isEnglish ? 'Type' : 'ধরন'}:
                    </Text>
                    <View style={styles.appointmentTypeContainer}>
                      <TouchableOpacity
                        style={[
                          styles.appointmentTypeButton,
                          appointmentData.appointmentType === 'anc' && styles.appointmentTypeButtonActive,
                          { backgroundColor: appointmentData.appointmentType === 'anc' ? '#4A90E2' : '#F5F7FA' }
                        ]}
                        onPress={() => setAppointmentData(prev => ({ ...prev, appointmentType: 'anc' }))}
                      >
                        <Text
                          style={[
                            styles.appointmentTypeText,
                            appointmentData.appointmentType === 'anc' && styles.appointmentTypeTextActive
                          ]}
                        >
                          {isEnglish ? 'ANC' : 'ANC'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.appointmentTypeButton,
                          appointmentData.appointmentType === 'immunization' && styles.appointmentTypeButtonActive,
                          { backgroundColor: appointmentData.appointmentType === 'immunization' ? '#FF9500' : '#F5F7FA' }
                        ]}
                        onPress={() => setAppointmentData(prev => ({ ...prev, appointmentType: 'immunization' }))}
                      >
                        <Text
                          style={[
                            styles.appointmentTypeText,
                            appointmentData.appointmentType === 'immunization' && styles.appointmentTypeTextActive
                          ]}
                        >
                          {isEnglish ? 'Immunization' : 'টিকাদান'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.appointmentTypeButton,
                          appointmentData.appointmentType === 'checkup' && styles.appointmentTypeButtonActive,
                          { backgroundColor: appointmentData.appointmentType === 'checkup' ? '#34C759' : '#F5F7FA' }
                        ]}
                        onPress={() => setAppointmentData(prev => ({ ...prev, appointmentType: 'checkup' }))}
                      >
                        <Text
                          style={[
                            styles.appointmentTypeText,
                            appointmentData.appointmentType === 'checkup' && styles.appointmentTypeTextActive
                          ]}
                        >
                          {isEnglish ? 'Checkup' : 'চেকআপ'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <BengaliTextInput
                    label={isEnglish ? 'Date' : 'তারিখ'}
                    value={appointmentData.date}
                    onChangeText={(text) => setAppointmentData(prev => ({ ...prev, date: text }))}
                    placeholder={isEnglish ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                    editable={false}
                    style={styles.formInput}
                  />

                  <BengaliTextInput
                    label={isEnglish ? 'Time' : 'সময়'}
                    value={appointmentData.time}
                    onChangeText={(text) => setAppointmentData(prev => ({ ...prev, time: text }))}
                    placeholder={isEnglish ? 'e.g., 10:00 AM' : 'যেমন, ১০:০০ AM'}
                    style={styles.formInput}
                  />

                  <BengaliTextInput
                    label={isEnglish ? 'Notes' : 'নোট'}
                    value={appointmentData.notes}
                    onChangeText={(text) => setAppointmentData(prev => ({ ...prev, notes: text }))}
                    placeholder={isEnglish ? 'Add notes (optional)' : 'নোট যোগ করুন (ঐচ্ছিক)'}
                    multiline={true}
                    numberOfLines={4}
                    style={styles.formInput}
                  />
                </View>

                <View style={styles.formActions}>
                  <BengaliButton
                    title={isEnglish ? 'Save Appointment' : 'অ্যাপয়েন্টমেন্ট সংরক্ষণ করুন'}
                    onPress={handleSaveAppointment}
                    loading={saving}
                    style={styles.saveButton}
                  />

                  <BengaliButton
                    title={isEnglish ? 'Cancel' : 'বাতিল করুন'}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                    primary={false}
                    style={styles.cancelButton}
                    disabled={saving}
                  />
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
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
    backgroundColor: '#5856D6',
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
  languageToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },

  // Calendar Styles
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Legend Styles
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666666',
  },

  // Appointments Styles
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentsList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addAppointmentButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
  },

  // Appointment Card Styles
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#666666',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalScrollContent: {
    padding: 20,
  },

  // Form Styles
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  formRow: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  formInput: {
    marginBottom: 16,
  },
  formActions: {
    marginTop: 24,
    marginBottom: 40,
  },
  saveButton: {
    marginBottom: 12,
    backgroundColor: '#4A90E2',
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },

  // Patient Selection Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultsContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    marginBottom: 16,
    maxHeight: 200,
  },
  searchResultsList: {
    padding: 8,
  },
  searchResultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  searchResultDetails: {
    fontSize: 14,
    color: '#666666',
  },
  noResultsText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedPatientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedPatientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  changePatientButton: {
    padding: 8,
  },
  changePatientButtonText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  // Appointment Type Styles
  appointmentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  appointmentTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  appointmentTypeButtonActive: {
    borderWidth: 0,
  },
  appointmentTypeText: {
    fontSize: 14,
    color: '#666666',
  },
  appointmentTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
