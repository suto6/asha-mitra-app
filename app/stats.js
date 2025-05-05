import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

import BottomNavBar from '@/components/BottomNavBar';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const { isEnglish } = useLanguage();

  // Text translations
  const translations = {
    title: isEnglish ? 'Analytics & Reports' : 'বিশ্লেষণ এবং প্রতিবেদন',
    subtitle: isEnglish ? 'Track progress and trends' : 'অগ্রগতি এবং প্রবণতা ট্র্যাক করুন',
    statsDashboard: isEnglish ? 'Statistics Dashboard' : 'পরিসংখ্যান ড্যাশবোর্ড',
    allAreas: isEnglish ? 'All Areas' : 'সব এলাকা',
    northVillage: isEnglish ? 'North Village' : 'উত্তর গ্রাম',
    southVillage: isEnglish ? 'South Village' : 'দক্ষিণ গ্রাম',
    eastVillage: isEnglish ? 'East Village' : 'পূর্ব গ্রাম',
    loading: isEnglish ? 'Loading statistics...' : 'পরিসংখ্যান লোড হচ্ছে...',
    
    // Follow-up reminders section
    followUpReminders: isEnglish ? 'Follow-Up Reminders' : 'ফলো-আপ রিমাইন্ডার',
    ancCheckupsDue: isEnglish ? 'ANC Checkups Due' : 'ANC চেকআপ বাকি',
    pncCheckupsDue: isEnglish ? 'PNC Checkups Due' : 'PNC চেকআপ বাকি',
    newbornHealthVisits: isEnglish ? 'Newborn Health Visits' : 'নবজাতকের স্বাস্থ্য পরিদর্শন',
    missedAppointments: isEnglish ? 'Missed Appointments' : 'মিস করা অ্যাপয়েন্টমেন্ট',
    
    // Area-wise summary section
    areaWiseSummary: isEnglish ? 'Area-Wise Summary' : 'এলাকা অনুযায়ী সারাংশ',
    pregnantWomenInArea: isEnglish ? 'Pregnant Women in Area' : 'এলাকায় গর্ভবতী মহিলা',
    childrenMissingVaccines: isEnglish ? 'Children Missing Vaccines' : 'টিকা বাকি আছে এমন শিশু',
    
    // Patient details
    patientName: isEnglish ? 'Patient Name' : 'রোগীর নাম',
    dueDate: isEnglish ? 'Due Date' : 'নির্ধারিত তারিখ',
    visitType: isEnglish ? 'Visit Type' : 'পরিদর্শনের ধরণ',
    priority: isEnglish ? 'Priority' : 'অগ্রাধিকার',
    high: isEnglish ? 'High' : 'উচ্চ',
    medium: isEnglish ? 'Medium' : 'মাঝারি',
    low: isEnglish ? 'Low' : 'নিম্ন',
    
    // Vaccine types
    bcg: isEnglish ? 'BCG' : 'বিসিজি',
    opv: isEnglish ? 'OPV' : 'ওপিভি',
    dpt: isEnglish ? 'DPT' : 'ডিপিটি',
    measles: isEnglish ? 'Measles' : 'হাম',
    
    // Action buttons
    viewDetails: isEnglish ? 'View Details' : 'বিস্তারিত দেখুন',
    scheduleVisit: isEnglish ? 'Schedule Visit' : 'পরিদর্শন নির্ধারণ করুন',
  };

  useEffect(() => {
    // In a real app, this would fetch stats from a database
    // For demo purposes, we're using placeholder data
    const mockStats = {
      followUpReminders: {
        ancCheckups: [
          { id: 1, name: 'Fatima Begum', dueDate: '2023-06-15', visitType: 'ANC 2nd Visit', priority: 'high' },
          { id: 2, name: 'Rahima Khatun', dueDate: '2023-06-18', visitType: 'ANC 3rd Visit', priority: 'medium' },
          { id: 3, name: 'Nasreen Akter', dueDate: '2023-06-20', visitType: 'ANC 1st Visit', priority: 'medium' },
        ],
        pncCheckups: [
          { id: 4, name: 'Taslima Begum', dueDate: '2023-06-14', visitType: 'PNC 1st Visit', priority: 'high' },
          { id: 5, name: 'Sharmin Akter', dueDate: '2023-06-16', visitType: 'PNC 2nd Visit', priority: 'medium' },
        ],
        newbornVisits: [
          { id: 6, name: 'Baby of Taslima', dueDate: '2023-06-14', visitType: 'BCG Vaccine', priority: 'high' },
          { id: 7, name: 'Baby of Momena', dueDate: '2023-06-17', visitType: 'Weight Check', priority: 'medium' },
          { id: 8, name: 'Baby of Rahima', dueDate: '2023-06-19', visitType: 'OPV Vaccine', priority: 'medium' },
        ],
        missedAppointments: [
          { id: 9, name: 'Sabina Yasmin', dueDate: '2023-06-10', visitType: 'ANC 4th Visit', priority: 'high' },
          { id: 10, name: 'Roksana Begum', dueDate: '2023-06-08', visitType: 'PNC 1st Visit', priority: 'high' },
        ],
      },
      areaWiseSummary: {
        pregnantWomen: {
          labels: [translations.northVillage, translations.southVillage, translations.eastVillage],
          datasets: [
            {
              data: [12, 8, 15],
              colors: [
                (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              ]
            }
          ]
        },
        childrenMissingVaccines: {
          labels: [translations.northVillage, translations.southVillage, translations.eastVillage],
          datasets: [
            {
              data: [5, 7, 3],
              colors: [
                (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              ]
            }
          ]
        },
        vaccinesMissing: {
          north: { bcg: 1, opv: 2, dpt: 1, measles: 1 },
          south: { bcg: 2, opv: 2, dpt: 2, measles: 1 },
          east: { bcg: 0, opv: 1, dpt: 1, measles: 1 },
        }
      }
    };

    setStats(mockStats);
    setLoading(false);
  }, [translations]);

  const renderBarChart = (data, title) => {
    if (!data) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.7,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

  const renderPatientCard = (patient) => {
    const priorityColors = {
      high: '#FF3B30',
      medium: '#FF9500',
      low: '#4CD964'
    };

    return (
      <View key={patient.id} style={styles.patientCard}>
        <View style={styles.patientHeader}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[patient.priority] }]}>
            <Text style={styles.priorityText}>
              {patient.priority === 'high' ? translations.high : 
               patient.priority === 'medium' ? translations.medium : translations.low}
            </Text>
          </View>
        </View>
        
        <View style={styles.patientDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{translations.dueDate}:</Text>
            <Text style={styles.detailValue}>{patient.dueDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{translations.visitType}:</Text>
            <Text style={styles.detailValue}>{patient.visitType}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye-outline" size={16} color="#4A90E2" />
            <Text style={styles.actionButtonText}>{translations.viewDetails}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={16} color="#4A90E2" />
            <Text style={styles.actionButtonText}>{translations.scheduleVisit}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{translations.title}</Text>
            <LanguageToggle style={styles.languageToggle} />
          </View>
          <Text style={styles.headerSubtitle}>{translations.subtitle}</Text>
        </View>

        {/* Stats Dashboard Banner */}
        <View style={styles.dashboardBanner}>
          <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
          <Text style={styles.dashboardText}>{translations.statsDashboard}</Text>
        </View>

        {/* Area Selector */}
        <View style={styles.selectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedArea === 'all' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedArea('all')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedArea === 'all' && styles.selectedSelectorButtonText
              ]}>
                {translations.allAreas}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedArea === 'north' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedArea('north')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedArea === 'north' && styles.selectedSelectorButtonText
              ]}>
                {translations.northVillage}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedArea === 'south' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedArea('south')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedArea === 'south' && styles.selectedSelectorButtonText
              ]}>
                {translations.southVillage}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedArea === 'east' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedArea('east')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedArea === 'east' && styles.selectedSelectorButtonText
              ]}>
                {translations.eastVillage}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{translations.loading}</Text>
          </View>
        ) : (
          <View style={styles.statsContainer}>
            {/* Follow-Up Reminders Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.followUpReminders}</Text>
              
              {/* ANC Checkups */}
              {stats.followUpReminders?.ancCheckups?.length > 0 && (
                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{translations.ancCheckupsDue}</Text>
                  {stats.followUpReminders.ancCheckups.map(patient => renderPatientCard(patient))}
                </View>
              )}
              
              {/* PNC Checkups */}
              {stats.followUpReminders?.pncCheckups?.length > 0 && (
                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{translations.pncCheckupsDue}</Text>
                  {stats.followUpReminders.pncCheckups.map(patient => renderPatientCard(patient))}
                </View>
              )}
              
              {/* Newborn Health Visits */}
              {stats.followUpReminders?.newbornVisits?.length > 0 && (
                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{translations.newbornHealthVisits}</Text>
                  {stats.followUpReminders.newbornVisits.map(patient => renderPatientCard(patient))}
                </View>
              )}
              
              {/* Missed Appointments */}
              {stats.followUpReminders?.missedAppointments?.length > 0 && (
                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{translations.missedAppointments}</Text>
                  {stats.followUpReminders.missedAppointments.map(patient => renderPatientCard(patient))}
                </View>
              )}
            </View>
            
            {/* Area-Wise Summary Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.areaWiseSummary}</Text>
              
              {/* Pregnant Women in Area */}
              {stats.areaWiseSummary?.pregnantWomen && (
                <View style={styles.chartSection}>
                  {renderBarChart(stats.areaWiseSummary.pregnantWomen, translations.pregnantWomenInArea)}
                </View>
              )}
              
              {/* Children Missing Vaccines */}
              {stats.areaWiseSummary?.childrenMissingVaccines && (
                <View style={styles.chartSection}>
                  {renderBarChart(stats.areaWiseSummary.childrenMissingVaccines, translations.childrenMissingVaccines)}
                </View>
              )}
              
              {/* Vaccine Details by Area */}
              {selectedArea !== 'all' && stats.areaWiseSummary?.vaccinesMissing && (
                <View style={styles.vaccineDetailsContainer}>
                  <Text style={styles.vaccineDetailsTitle}>
                    {translations.childrenMissingVaccines} - {
                      selectedArea === 'north' ? translations.northVillage :
                      selectedArea === 'south' ? translations.southVillage :
                      translations.eastVillage
                    }
                  </Text>
                  
                  <View style={styles.vaccineGrid}>
                    {Object.entries(stats.areaWiseSummary.vaccinesMissing[selectedArea] || {}).map(([vaccine, count]) => (
                      <View key={vaccine} style={styles.vaccineBadge}>
                        <Text style={styles.vaccineCount}>{count}</Text>
                        <Text style={styles.vaccineName}>{translations[vaccine] || vaccine}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        
        <View style={styles.bottomNavSpace} />
      </ScrollView>
      
      <BottomNavBar currentScreen="stats" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  dashboardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dashboardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedSelectorButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  selectorButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedSelectorButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  statsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  patientDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 4,
  },
  chartSection: {
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  vaccineDetailsContainer: {
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
  vaccineDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  vaccineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vaccineBadge: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  vaccineCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 4,
  },
  vaccineName: {
    fontSize: 14,
    color: '#666666',
  },
  bottomNavSpace: {
    height: 90,
  },
});
