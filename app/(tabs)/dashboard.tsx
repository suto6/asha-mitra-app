import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import StatusCard from '@/components/StatusCard';
import MeetingItem from '@/components/MeetingItem';
import BottomNavBar from '@/components/BottomNavBar';
import LanguageToggle from '@/components/LanguageToggle';
import BengaliText from '@/constants/BengaliText';
import { searchPatientsByName, getAppointmentsByDate, toggleAppointmentCompletion } from '@/services/patientService';

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

  interface Patient {
    id: string;
    name: string;
    age: string;
    lastVisit: string;
    lmpDate: string;
  }

  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const dailyStatus = {
    assigned: 29,
    open: 10,
  };

  // Function to fetch recent patients
  const fetchRecentPatients = async () => {
    setLoading(true);
    try {
      // Fetch recent patients from local storage
      const result = await searchPatientsByName();

      if (result.success && result.patients.length > 0) {
        // Map the data to match our Patient interface
        const patients = result.patients.map((patient: any) => ({
          id: patient.id,
          name: patient.name,
          age: patient.age,
          lastVisit: patient.created_at ? new Date(patient.created_at).toISOString().split('T')[0] : '',
          lmpDate: patient.lmpDate || '',
        }));

        setRecentPatients(patients);
      } else {
        console.error('Failed to fetch recent patients or no patients found:', result.error);
        // Set empty array if no patients found
        setRecentPatients([]);
      }
    } catch (error) {
      console.error('Error fetching recent patients:', error);
      // Set empty array if fetch fails
      setRecentPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch today's appointments
  const fetchTodaysAppointments = async () => {
    setLoadingAppointments(true);
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedToday = `${year}-${month}-${day}`;

      console.log('Dashboard - Today\'s date (formatted):', formattedToday);

      // Fetch appointments for today
      const result = await getAppointmentsByDate(formattedToday);

      if (result.success) {
        console.log('Dashboard - Appointments found:', result.appointments.length);
        console.log('Dashboard - Appointment dates:', result.appointments.map((a: any) => a.date));
        setTodaysAppointments(result.appointments);
      } else {
        console.error('Failed to fetch today\'s appointments:', result.error);
        setTodaysAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      setTodaysAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Function to toggle appointment completion
  const handleToggleCompletion = async (appointmentId: string, event: any) => {
    // Prevent the parent TouchableOpacity from being triggered
    event.stopPropagation();

    try {
      const result = await toggleAppointmentCompletion(appointmentId);

      if (result.success) {
        // Refresh the appointments list
        fetchTodaysAppointments();
      } else {
        console.error('Failed to toggle appointment completion:', result.error);
      }
    } catch (error) {
      console.error('Error toggling appointment completion:', error);
    }
  };

  // Use useFocusEffect to refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Dashboard focused, refreshing data...');
      fetchRecentPatients();
      fetchTodaysAppointments();

      // No cleanup needed for this effect
      return () => {};
    }, [])
  );

  const handleLogout = async () => {
    setLoading(true);
    const result = await logout();
    setLoading(false);

    if (result.success) {
      router.replace('/(auth)/login');
    }
  };



  const navigateToPatientDetails = (patientId: string) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/health-bg.jpg')}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(245,247,250,1)']}
          style={styles.gradientOverlay}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header with Profile */}
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={['#4A90E2', '#6A5ACD']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
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
              </LinearGradient>
            </View>


            {/* Today's Appointments */}
            <View style={styles.appointmentsSection}>
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
                {loadingAppointments ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.loadingText}>
                      {isEnglish ? 'Loading appointments...' : 'অ্যাপয়েন্টমেন্ট লোড হচ্ছে...'}
                    </Text>
                  </View>
                ) : todaysAppointments.length > 0 ? (
                  todaysAppointments.map((appointment: any) => {
                    // Get appointment type color
                    const typeColor = appointment.appointmentType === 'anc' ? '#4A90E2' :
                                      appointment.appointmentType === 'immunization' ? '#FF9500' :
                                      '#34C759';

                    // Get appointment type text
                    const typeText = appointment.appointmentType === 'anc' ? translations.ancCheckup :
                                     appointment.appointmentType === 'immunization' ? translations.immunization :
                                     isEnglish ? 'Checkup' : 'চেকআপ';

                    // Split time into hours and AM/PM
                    const timeParts = appointment.time ? appointment.time.split(' ') : ['', ''];
                    const timeValue = timeParts[0] || '';
                    const timePeriod = timeParts[1] || '';

                    return (
                      <TouchableOpacity
                        key={appointment.id}
                        style={[
                          styles.appointmentCard,
                          appointment.completed && styles.completedAppointmentCard
                        ]}
                        activeOpacity={0.7}
                        onPress={() => router.push({
                          pathname: '/patient/[id]',
                          params: { id: appointment.patientId }
                        })}
                      >
                        <View style={[styles.appointmentTypeIndicator, { backgroundColor: typeColor }]} />
                        <View style={styles.appointmentTimeContainer}>
                          <Text style={[
                            styles.appointmentTime,
                            appointment.completed && styles.completedText
                          ]}>{timeValue}</Text>
                          <Text style={[
                            styles.appointmentTimeAMPM,
                            appointment.completed && styles.completedText
                          ]}>{timePeriod}</Text>
                        </View>
                        <View style={styles.appointmentDetails}>
                          <Text style={[
                            styles.appointmentTitle,
                            appointment.completed && styles.completedText
                          ]}>{appointment.patientName}</Text>
                          <Text style={[
                            styles.appointmentSubtitle,
                            appointment.completed && styles.completedText
                          ]}>{typeText}</Text>
                        </View>
                        <View style={styles.appointmentActions}>
                          <TouchableOpacity
                            style={[
                              styles.checkboxContainer,
                              appointment.completed && styles.checkboxContainerChecked
                            ]}
                            onPress={(e) => handleToggleCompletion(appointment.id, e)}
                          >
                            {appointment.completed ? (
                              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            ) : (
                              <Text style={styles.completeButtonText}>
                                {translations.markComplete}
                              </Text>
                            )}
                          </TouchableOpacity>
                          <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.emptyAppointmentsContainer}>
                    <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
                    <Text style={styles.emptyStateText}>
                      {isEnglish ? 'No appointments for today' : 'আজকের জন্য কোন অ্যাপয়েন্টমেন্ট নেই'}
                    </Text>
                    <TouchableOpacity
                      style={styles.addAppointmentButton}
                      onPress={() => router.push('/patient/schedule' as any)}
                    >
                      <Text style={styles.addAppointmentButtonText}>
                        {isEnglish ? 'Add Appointment' : 'অ্যাপয়েন্টমেন্ট যোগ করুন'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>{translations.quickActions}</Text>

              <View style={styles.actionCardsContainer}>
                <TouchableOpacity
                  style={[styles.actionCard, styles.actionCard1]}
                  onPress={() => router.push('/add' as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4CD964', '#34C759']}
                    style={styles.actionIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="add-circle" size={28} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.actionCardTitle}>{translations.addNewPatient}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionCard, styles.actionCard2]}
                  onPress={() => router.push('/search' as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4A90E2', '#5B6AE0']}
                    style={styles.actionIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="search" size={28} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.actionCardTitle}>{translations.searchByName}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionCard, styles.actionCard3]}
                  onPress={() => router.push('/patient/schedule' as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#5856D6', '#AF52DE']}
                    style={styles.actionIconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="calendar" size={28} color="#FFFFFF" />
                  </LinearGradient>
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

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4A90E2" />
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recentPatientsScroll}
                >
                  {recentPatients.length > 0 ? (
                    recentPatients.map((patient, index) => {
                      // Determine card style and tag color based on index or patient type
                      const cardStyle = index % 3 === 0 ? styles.recentPatientCard1 :
                                        index % 3 === 1 ? styles.recentPatientCard2 :
                                        styles.recentPatientCard3;

                      const tagColor = index % 3 === 0 ? '#4A90E2' :
                                      index % 3 === 1 ? '#FF9500' :
                                      '#34C759';

                      // Determine patient type text
                      const patientType = index % 3 === 0 ? translations.pregnant :
                                         index % 3 === 1 ? translations.newborn :
                                         translations.child;

                      // Format date for display
                      const today = new Date().toISOString().split('T')[0];
                      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                      let dateText = patient.lastVisit;
                      if (patient.lastVisit === today) {
                        dateText = translations.today;
                      } else if (patient.lastVisit === yesterday) {
                        dateText = translations.yesterday;
                      }

                      return (
                        <TouchableOpacity
                          key={patient.id}
                          style={[styles.recentPatientCard, cardStyle]}
                          activeOpacity={0.7}
                          onPress={() => navigateToPatientDetails(patient.id)}
                        >
                          <View style={[styles.patientTypeTag, { backgroundColor: tagColor }]}>
                            <Text style={styles.patientTypeText}>{patientType}</Text>
                          </View>
                          <Text style={styles.recentPatientName}>{patient.name}</Text>
                          <Text style={styles.recentPatientDate}>{dateText}</Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    // Empty state when no patients are found
                    <View style={styles.recentPatientsEmptyContainer}>
                      <Ionicons name="people-outline" size={48} color="#CCCCCC" />
                      <Text style={styles.emptyStateText}>
                        {isEnglish ? 'No patients added yet' : 'এখনও কোন রোগী যোগ করা হয়নি'}
                      </Text>
                      <TouchableOpacity
                        style={styles.addPatientButton}
                        onPress={() => router.push('/add' as any)}
                      >
                        <Text style={styles.addPatientButtonText}>
                          {isEnglish ? 'Add Patient' : 'রোগী যোগ করুন'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              )}
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



            {/* Extra space for bottom nav */}
            <View style={styles.bottomNavSpace} />
          </ScrollView>

          {/* Bottom Navigation Bar */}
          <BottomNavBar />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    paddingBottom: 30,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryContent: {
    marginTop: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  summaryItem1: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  summaryItem2: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  summaryItem3: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionCard1: {
    borderTopWidth: 4,
    borderTopColor: '#4CD964',
  },
  actionCard2: {
    borderTopWidth: 4,
    borderTopColor: '#4A90E2',
  },
  actionCard3: {
    borderTopWidth: 4,
    borderTopColor: '#5856D6',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  recentPatientsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recentPatientsScroll: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  recentPatientCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  recentPatientCard1: {
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  recentPatientCard2: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  recentPatientCard3: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  patientTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
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
    marginBottom: 8,
  },
  recentPatientDate: {
    fontSize: 12,
    color: '#666666',
  },
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  bottomNavSpace: {
    height: 90,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  recentPatientsEmptyContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
  },
  emptyAppointmentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  addPatientButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addPatientButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addAppointmentButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addAppointmentButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completedAppointmentCard: {
    backgroundColor: '#F5F7FA',
    borderColor: '#34C759',
    borderWidth: 1,
  },
  completedText: {
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  checkboxContainer: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#34C759',
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainerChecked: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
  },
});