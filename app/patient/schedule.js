import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

import BengaliText from '@/constants/BengaliText';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would fetch appointments from a database
    // For demo purposes, we're using placeholder data
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;
    
    setSelectedDate(formattedToday);
    
    const mockAppointments = [
      {
        id: '1',
        patientId: '1',
        patientName: 'পিঙ্কি বিশ্বাস',
        patientType: 'pregnant',
        appointmentType: 'anc',
        date: formattedToday,
        time: '10:00 AM',
        notes: 'ANC পরিদর্শন',
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'সুমিতা রায়',
        patientType: 'pregnant',
        appointmentType: 'anc',
        date: formattedToday,
        time: '11:30 AM',
        notes: 'ANC পরিদর্শন',
      },
      {
        id: '3',
        patientId: '3',
        patientName: 'অনিতা দাস',
        patientType: 'newborn',
        appointmentType: 'immunization',
        date: `${year}-${month}-${String(today.getDate() + 1).padStart(2, '0')}`,
        time: '09:00 AM',
        notes: 'টিকাদান',
      },
      {
        id: '4',
        patientId: '4',
        patientName: 'রাজু সিং',
        patientType: 'child',
        appointmentType: 'checkup',
        date: `${year}-${month}-${String(today.getDate() + 2).padStart(2, '0')}`,
        time: '02:00 PM',
        notes: 'নিয়মিত পরীক্ষা',
      },
    ];
    
    setAppointments(mockAppointments);
    
    // Create marked dates for the calendar
    const marked = {};
    mockAppointments.forEach(appointment => {
      marked[appointment.date] = {
        marked: true,
        dotColor: appointment.appointmentType === 'anc' ? '#4A90E2' : 
                  appointment.appointmentType === 'immunization' ? '#FF9500' : '#34C759',
      };
    });
    
    // Highlight selected date
    marked[formattedToday] = {
      ...marked[formattedToday],
      selected: true,
      selectedColor: '#4A90E2',
    };
    
    setMarkedDates(marked);
    setLoading(false);
  }, []);

  const handleDateSelect = (day) => {
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
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>{BengaliText.SCHEDULE_CALENDAR}</Text>
            <View style={styles.placeholderView} />
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
            <Text style={styles.legendText}>{BengaliText.ANC_VISITS}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
            <Text style={styles.legendText}>{BengaliText.IMMUNIZATION}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
            <Text style={styles.legendText}>চেকআপ</Text>
          </View>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsContainer}>
          <Text style={styles.appointmentsTitle}>
            {selectedDate ? `${selectedDate} তারিখের অ্যাপয়েন্টমেন্ট` : 'অ্যাপয়েন্টমেন্ট'}
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
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
                এই তারিখে কোন অ্যাপয়েন্টমেন্ট নেই
              </Text>
            </View>
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
  appointmentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
    textAlign: 'center',
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
});
