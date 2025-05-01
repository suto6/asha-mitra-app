import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ProfileHeader from '@/components/ProfileHeader';
import StatusCard from '@/components/StatusCard';
import MeetingItem from '@/components/MeetingItem';
import ActionButton from '@/components/ActionButton';

export default function DashboardScreen() {
  const { userProfile } = useAuth();

  // Mock data for status
  const dailyStatus = {
    assigned: 29,
    open: 10,
  };

  // Mock data for meetings
  const todaysMeetings = [
    {
      id: '1',
      title: 'Synit Prakashen',
      subtitle: 'Maternal UHID',
      time: '3:00 PM',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Synit Prakashen',
      subtitle: 'Maternal UHID',
      time: '5:00 PM',
      status: 'upcoming',
    },
  ];

  // Mock data for action buttons
  const actionButtons = [
    {
      id: '1',
      title: 'Assigned Assignment Centers',
      icon: 'people',
      color: '#FF9500',
    },
    {
      id: '2',
      title: 'Monthly Planner',
      icon: 'calendar',
      color: '#FF3B30',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        {/* <ProfileHeader 
          name={userProfile?.name || 'Sameer Singh'} 
          role={userProfile?.role || 'ASHA Kormi'} 
        /> */}

        {/* Daily Status Card */}
        <StatusCard 
          title="Daily Status"
          stats={[
            { label: 'Assigned ANCS', value: dailyStatus.assigned, color: '#4CD964' },
            // { label: 'ANC's Open', value: dailyStatus.open, color: '#FF9500' },
          ]}
          onViewAll={() => console.log('View all status')}
        />

        {/* Debrief Card */}
        <View style={styles.debriefCard}>
          <View style={styles.debriefContent}>
            <Text style={styles.debriefTitle}>Debrief</Text>
            <TouchableOpacity style={styles.debriefButton}>
              <Text style={styles.debriefButtonText}>Debrief</Text>
              <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Meetings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Todays meetings</Text>
          
          {todaysMeetings.map(meeting => (
            <MeetingItem 
              key={meeting.id}
              title={meeting.title}
              subtitle={meeting.subtitle}
              time={meeting.time}
              status={meeting.status}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {actionButtons.map(button => (
            <ActionButton
              key={button.id}
              title={button.title}
              icon={button.icon}
              color={button.color}
              onPress={() => console.log(`Pressed ${button.title}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  debriefCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  debriefContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debriefTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  debriefButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debriefButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
});
