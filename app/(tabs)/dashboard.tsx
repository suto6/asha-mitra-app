import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ProfileHeader from '@/components/ProfileHeader';
import StatusCard from '@/components/StatusCard';
import MeetingItem from '@/components/MeetingItem';
import ActionButton from '@/components/ActionButton';
import HealthDataCard from '@/components/HealthDataCard';
import BottomNavBar from '@/components/BottomNavBar';
import BengaliText from '@/constants/BengaliText';

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
      title: 'নির্ধারিত কেন্দ্র',
      icon: 'people',
      color: '#FF9500',
    },
    {
      id: '2',
      title: 'মাসিক পরিকল্পনা',
      icon: 'calendar',
      color: '#FF3B30',
    },
  ];

  // Mock health data
  const healthData = {
    target: 345,
    consumed: 125,
    remaining: 220,
  };

  // Mock heart rate data
  const heartRateData = [78, 82, 75, 88, 92, 85, 79, 82, 90, 86, 82, 78];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <ProfileHeader
          name={userProfile?.name || 'Sameer Singh'}
          role={userProfile?.role || 'আশা কর্মী'}
          onProfilePress={() => console.log('Profile pressed')}
        />

        {/* Health Data Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>আপনার স্বাস্থ্য তথ্য</Text>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayButtonText}>আজ</Text>
            <Ionicons name="chevron-down" size={16} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Health Data Card */}
        <HealthDataCard
          title="ক্যালোরি"
          target={healthData.target}
          consumed={healthData.consumed}
          remaining={healthData.remaining}
          color="#8E5D9F"
        />

        {/* Heart Rate Card */}
        <View style={[styles.card, styles.heartRateCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="heart" size={20} color="#FF5757" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>হার্ট রেট</Text>
            </View>
            <Text style={styles.heartRateValue}>102</Text>
          </View>

          <View style={styles.heartRateGraph}>
            {heartRateData.map((value, index) => (
              <View
                key={index}
                style={[
                  styles.heartRateBar,
                  { height: value * 0.8, marginLeft: index > 0 ? 5 : 0 }
                ]}
              />
            ))}
          </View>

          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>08:00</Text>
            <Text style={styles.timeLabel}>09:00</Text>
            <Text style={styles.timeLabel}>10:00</Text>
            <Text style={styles.timeLabel}>11:00</Text>
          </View>
        </View>

        {/* Daily Status Card */}
        <StatusCard
          title="দৈনিক স্ট্যাটাস"
          stats={[
            { label: 'নির্ধারিত ANC', value: dailyStatus.assigned, color: '#4CD964' },
            { label: 'ANC খোলা', value: dailyStatus.open, color: '#FF9500' },
          ]}
          onViewAll={() => console.log('View all status')}
        />

        {/* Debrief Card */}
        <View style={styles.card}>
          <View style={styles.debriefContent}>
            <Text style={styles.cardTitle}>ডিব্রিফ</Text>
            <TouchableOpacity style={styles.debriefButton}>
              <Text style={styles.debriefButtonText}>ডিব্রিফ</Text>
              <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Meetings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>আজকের মিটিং</Text>

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
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for bottom nav
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  todayButtonText: {
    fontSize: 14,
    color: '#555555',
    marginRight: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heartRateCard: {
    backgroundColor: '#E8E1F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  heartRateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  heartRateGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 8,
  },
  heartRateBar: {
    width: 6,
    backgroundColor: '#6A5ACD',
    borderRadius: 3,
    flex: 1,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#888888',
  },
  debriefCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  bottomNavSpace: {
    height: 60,
  },
});
