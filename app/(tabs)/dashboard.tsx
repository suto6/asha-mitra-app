import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import StatusCard from '@/components/StatusCard';
import MeetingItem from '@/components/MeetingItem';
import BottomNavBar from '@/components/BottomNavBar';
import LanguageToggle from '@/components/LanguageToggle';
import BengaliText from '@/constants/BengaliText';

export default function DashboardScreen() {
  const { userProfile, logout } = useAuth();
  const { isEnglish } = useLanguage();

  // Text translations
  const translations = {
    welcome: isEnglish ? 'Welcome' : 'স্বাগতম',
    dailyActionCenter: isEnglish ? 'Daily Action Center' : 'দৈনিক কার্য কেন্দ্র',
    todaysTasks: isEnglish ? 'Today\'s Tasks' : 'আজকের কাজ',
    pendingVisits: isEnglish ? 'Pending Visits' : 'বাকি পরিদর্শন',
    ancCheckups: isEnglish ? 'ANC checkups pending' : 'ANC চেকআপ বাকি আছে',
    immunizationDue: isEnglish ? 'immunization due today' : 'টিকাদান আজ বাকি আছে',
    highRiskPregnant: isEnglish ? 'high risk pregnant woman' : 'উচ্চ ঝুঁকিপূর্ণ গর্ভবতী',
    todaysAppointments: isEnglish ? 'Today\'s Appointments' : 'আজকের অ্যাপয়েন্টমেন্ট',
    thisWeeksAppointments: isEnglish ? 'This Week\'s Appointments' : 'এই সপ্তাহের অ্যাপয়েন্টমেন্ট',
    viewAll: isEnglish ? 'View All' : 'সব দেখুন',
    ancCheckup: isEnglish ? 'ANC Checkup' : 'ANC চেকআপ',
    immunization: isEnglish ? 'Immunization' : 'টিকাদান',
    quickActions: isEnglish ? 'Quick Actions' : BengaliText.QUICK_ACTIONS,
    addNewPatient: isEnglish ? 'Add New Patient' : BengaliText.ADD_NEW_PATIENT,
    searchByName: isEnglish ? 'Search by Name' : BengaliText.SEARCH_BY_NAME,
    scheduleVisit: isEnglish ? 'Schedule Visit' : 'পরিদর্শন সময়সূচি',
    recentlyAdded: isEnglish ? 'Recently Added Patients' : 'সাম্প্রতিক পেশেন্ট',
    tipsOfTheDay: isEnglish ? 'Tips of the Day' : 'আজকের টিপস',
    drinkWater: isEnglish ? 'Drink plenty of water during pregnancy' : 'গর্ভাবস্থায় পর্যাপ্ত পানি পান করুন',
    waterTip: isEnglish ? 'Pregnant women should drink at least 8-10 glasses of water daily.' : 'গর্ভবতী মহিলাদের প্রতিদিন কমপক্ষে ৮-১০ গ্লাস পানি পান করা উচিত।',
    childNutrition: isEnglish ? 'Child Nutrition' : 'শিশুর পুষ্টি',
    nutritionTip: isEnglish ? 'Babies should be exclusively breastfed for the first 6 months.' : '৬ মাস পর্যন্ত শিশুকে শুধুমাত্র মায়ের দুধ খাওয়ানো উচিত।',
    immunizationSchedule: isEnglish ? 'Immunization Schedule' : 'টিকাদান সময়সূচি',
    scheduleTip: isEnglish ? 'Ensure all vaccines are given on time from birth.' : 'শিশুর জন্মের পর থেকে সময়মত সব টিকা দেওয়া নিশ্চিত করুন।',
    today: isEnglish ? 'Today' : 'আজ',
    tomorrow: isEnglish ? 'Tomorrow' : 'আগামীকাল',
    yesterday: isEnglish ? 'Yesterday' : 'গতকাল',
    markComplete: isEnglish ? 'Mark Complete' : 'সম্পন্ন চিহ্নিত করুন',
    pregnant: isEnglish ? 'Pregnant' : BengaliText.PREGNANT,
    newborn: isEnglish ? 'Newborn' : BengaliText.NEWBORN,
    child: isEnglish ? 'Child' : BengaliText.CHILD,
  };
  // Define patient type
  interface Patient {
    id: string;
    name: string;
    age: string;
    lastVisit: string;
    lmpDate: string;
  }

  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

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

  // No longer needed

  useEffect(() => {
    // In a real implementation, we would fetch recent patients
    // For demo purposes, we're using placeholder data
    setRecentPatients([
      {
        id: '1',
        name: 'পিঙ্কি বিশ্বাস',
        age: '25',
        lastVisit: '২০২৩-০৫-১০',
        lmpDate: '২০২৩-০৪-০১',
      },
      {
        id: '2',
        name: 'সুমিতা রায়',
        age: '22',
        lastVisit: '২০২৩-০৫-০৮',
        lmpDate: '২০২৩-০৩-১৫',
      },
    ]);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const result = await logout();
    setLoading(false);

    if (result.success) {
      router.replace('/(auth)/login');
    }
  };

  // Navigation functions
  const navigateToSearchPatient = () => {
    router.push('/(tabs)/search-patient');
  };

  const navigateToPatientDetails = (patientId: string) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Profile */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userProfile?.name ? userProfile.name.charAt(0) : 'অ'}
                </Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>
                  {translations.welcome}, {userProfile?.name || 'ASHA Mitra'}
                </Text>
                <Text style={styles.subtitle}>{translations.dailyActionCenter}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <LanguageToggle style={styles.languageToggle} />
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={loading}
              >
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Daily Action Center Banner */}
        <View style={styles.actionCenterBanner}>
          <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
          <Text style={styles.actionCenterText}>{translations.dailyActionCenter}</Text>
        </View>

        {/* Daily Tasks Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>{translations.todaysTasks}</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
              <Text style={styles.summaryText}>২ টি {translations.ancCheckups}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="medkit-outline" size={24} color="#FF9500" />
              <Text style={styles.summaryText}>১ টি {translations.immunizationDue}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="warning-outline" size={24} color="#FF3B30" />
              <Text style={styles.summaryText}>১ জন {translations.highRiskPregnant}</Text>
            </View>
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.appointmentsSection} />
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{translations.todaysAppointments}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/patient/schedule' as any)}
            >
              <Text style={styles.viewAllText}>{translations.viewAll}</Text>
              <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentsList}>
            <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.7}>
              <View style={[styles.appointmentTypeIndicator, { backgroundColor: '#4A90E2' }]} />
              <View style={styles.appointmentTimeContainer}>
                <Text style={styles.appointmentTime}>10:00</Text>
                <Text style={styles.appointmentTimeAMPM}>AM</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentTitle}>পিঙ্কি বিশ্বাস</Text>
                <Text style={styles.appointmentSubtitle}>{translations.ancCheckup}</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.completeButton}>
                  <Text style={styles.completeButtonText}>{translations.markComplete}</Text>
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.7}>
              <View style={[styles.appointmentTypeIndicator, { backgroundColor: '#FF9500' }]} />
              <View style={styles.appointmentTimeContainer}>
                <Text style={styles.appointmentTime}>11:30</Text>
                <Text style={styles.appointmentTimeAMPM}>AM</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentTitle}>অনিতা দাস</Text>
                <Text style={styles.appointmentSubtitle}>{translations.immunization}</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.completeButton}>
                  <Text style={styles.completeButtonText}>{translations.markComplete}</Text>
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
              </View>
            </TouchableOpacity>
          </View>

          

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{translations.quickActions}</Text>

          <View style={styles.actionCardsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/add' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#4CD964' }]}>
                <Ionicons name="add-circle" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionCardTitle}>{translations.addNewPatient}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/search' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#4A90E2' }]}>
                <Ionicons name="search" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionCardTitle}>{translations.searchByName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/patient/schedule' as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#5856D6' }]}>
                <Ionicons name="calendar" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionCardTitle}>{translations.scheduleVisit}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recently Added Patients */}
        <View style={styles.recentPatientsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{translations.recentlyAdded}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/patient/list' as any)}
            >
              <Text style={styles.viewAllText}>{translations.viewAll}</Text>
              <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentPatientsScroll}
          >
            <TouchableOpacity style={styles.recentPatientCard} activeOpacity={0.7}>
              <View style={[styles.patientTypeTag, { backgroundColor: '#4A90E2' }]}>
                <Text style={styles.patientTypeText}>{translations.pregnant}</Text>
              </View>
              <Text style={styles.recentPatientName}>পিঙ্কি বিশ্বাস</Text>
              <Text style={styles.recentPatientDate}>{translations.today}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentPatientCard} activeOpacity={0.7}>
              <View style={[styles.patientTypeTag, { backgroundColor: '#FF9500' }]}>
                <Text style={styles.patientTypeText}>{translations.newborn}</Text>
              </View>
              <Text style={styles.recentPatientName}>অনিতা দাস</Text>
              <Text style={styles.recentPatientDate}>{translations.today}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentPatientCard} activeOpacity={0.7}>
              <View style={[styles.patientTypeTag, { backgroundColor: '#34C759' }]}>
                <Text style={styles.patientTypeText}>{translations.child}</Text>
              </View>
              <Text style={styles.recentPatientName}>রাজু সিং</Text>
              <Text style={styles.recentPatientDate}>{translations.yesterday}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

       
        {/* Daily Status Card */}
        <View style={styles.statusSection}>
          <StatusCard
            title={BengaliText.dailyStatus}
            stats={[
              { label: BengaliText.assignedANCs, value: dailyStatus.assigned, color: '#4CD964' },
              { label: BengaliText.openANCs, value: dailyStatus.open, color: '#FF9500' },
            ]}
            onViewAll={() => console.log('View all status')}
          />
        </View>

        {/* Recent Patients Section */}
        <View style={styles.recentPatientsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{BengaliText.RECENT_PATIENTS}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={navigateToSearchPatient}
            >
              <Text style={styles.viewAllText}>{BengaliText.SEARCH_PATIENT}</Text>
              <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          {recentPatients.length > 0 ? (
            <View style={styles.patientCardsContainer}>
              {recentPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.patientCard}
                  onPress={() => navigateToPatientDetails(patient.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.patientIconContainer}>
                    <Ionicons name="person" size={24} color="#4A90E2" />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>
                      {BengaliText.AGE}: {patient.age} | {BengaliText.LMP_DATE}: {patient.lmpDate}
                    </Text>
                  </View>
                  <View style={styles.patientCardAction}>
                    <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="people" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>{BengaliText.NO_RECENT_PATIENTS}</Text>
            </View>
          )}
        </View>

        {/* Today's Meetings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{BengaliText.todaysMeetings}</Text>

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
    paddingBottom: 100, // Extra space for bottom nav
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#4A90E2',
    paddingTop: 60,
    paddingBottom: 30,
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggle: {
    marginRight: 12,
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Health Data Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
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

  // Summary Card Styles
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContent: {
    marginTop: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },

  // Appointments Styles
  appointmentsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  appointmentsList: {
    marginTop: 10,
  },
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
  appointmentTypeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  appointmentTimeContainer: {
    alignItems: 'center',
    width: 60,
  },
  appointmentTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  appointmentTimeAMPM: {
    fontSize: 12,
    color: '#666666',
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  appointmentSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  appointmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
  },
  completeButtonText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  upcomingAppointment: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 0,
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: 12,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  dateMonth: {
    fontSize: 14,
    color: '#666666',
  },
  dateLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },

  // Quick Actions Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },

  // Recent Patients Styles
  recentPatientsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recentPatientsScroll: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  recentPatientCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  patientTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recentPatientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  recentPatientDate: {
    fontSize: 12,
    color: '#666666',
  },

  // Pending Visits Styles
  pendingVisitsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pendingVisitsList: {
    marginTop: 10,
  },
  pendingVisitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  pendingVisitContent: {
    flex: 1,
  },
  pendingVisitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  pendingVisitInfo: {
    fontSize: 14,
    color: '#666666',
  },
  scheduleButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

 
  
  // Action Center Banner
  actionCenterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  actionCenterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },

  // Status Section
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Debrief Styles
  debriefContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  // Section Styles
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 4,
  },
  patientCardsContainer: {
    marginBottom: 20,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666666',
  },
  patientCardAction: {
    padding: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },

  // Meetings Section
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },

  // Bottom Nav Space
  bottomNavSpace: {
    height: 90,
  },
});
