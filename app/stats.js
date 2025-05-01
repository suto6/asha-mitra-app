import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';

import BengaliText from '@/constants/BengaliText';
import BottomNavBar from '@/components/BottomNavBar';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedArea, setSelectedArea] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const { isEnglish } = useLanguage();

  // Text translations
  const translations = {
    title: isEnglish ? 'Reports' : BengaliText.REPORTS,
    subtitle: isEnglish ? 'Monthly Statistics' : 'মাসিক পরিসংখ্যান',
    weekly: isEnglish ? 'Weekly' : 'সাপ্তাহিক',
    monthly: isEnglish ? 'Monthly' : 'মাসিক',
    quarterly: isEnglish ? 'Quarterly' : 'ত্রৈমাসিক',
    yearly: isEnglish ? 'Yearly' : 'বার্ষিক',
    allAreas: isEnglish ? 'All Areas' : 'সব এলাকা',
    northVillage: isEnglish ? 'North Village' : 'উত্তর গ্রাম',
    southVillage: isEnglish ? 'South Village' : 'দক্ষিণ গ্রাম',
    eastVillage: isEnglish ? 'East Village' : 'পূর্ব গ্রাম',
    loading: isEnglish ? 'Loading statistics...' : 'পরিসংখ্যান লোড হচ্ছে...',
    monthlySummary: isEnglish ? 'Monthly Summary' : 'মাসিক সারাংশ',
    ancVisits: isEnglish ? 'ANC Visits' : 'ANC পরিদর্শন',
    deliveries: isEnglish ? 'Deliveries' : 'প্রসব',
    immunizations: isEnglish ? 'Immunizations' : 'টিকাদান',
    progress: isEnglish ? 'Progress' : 'অগ্রগতি',
    ironTablets: isEnglish ? 'Iron Tablets Given' : 'আয়রন ট্যাবলেট প্রদান',
    pncCheckups: isEnglish ? 'PNC Checkups Completed' : 'PNC চেকআপ সম্পন্ন',
    pregnantWomenByTrimester: isEnglish ? 'Pregnant Women by Trimester' : 'ত্রৈমাসিক অনুসারে গর্ভবতী মহিলা',
    riskCasesIdentified: isEnglish ? 'Risk Cases Identified' : 'চিহ্নিত ঝুঁকিপূর্ণ কেস',
    childrenVaccinationStatus: isEnglish ? 'Children Vaccination Status' : 'শিশুদের টিকাদান অবস্থা',
    monthlyTrend: isEnglish ? 'Monthly Trend' : 'মাসিক প্রবণতা',
    firstTrimester: isEnglish ? '1st Trimester' : '১ম ত্রৈমাসিক',
    secondTrimester: isEnglish ? '2nd Trimester' : '২য় ত্রৈমাসিক',
    thirdTrimester: isEnglish ? '3rd Trimester' : '৩য় ত্রৈমাসিক',
    highRisk: isEnglish ? 'High Risk' : 'উচ্চ ঝুঁকি',
    mediumRisk: isEnglish ? 'Medium Risk' : 'মাঝারি ঝুঁকি',
    lowRisk: isEnglish ? 'Low Risk' : 'কম ঝুঁকি',
    fullyVaccinated: isEnglish ? 'Fully Vaccinated' : 'সম্পূর্ণ টিকাপ্রাপ্ত',
    partiallyVaccinated: isEnglish ? 'Partially Vaccinated' : 'আংশিক টিকাপ্রাপ্ত',
    notVaccinated: isEnglish ? 'Not Vaccinated' : 'টিকা দেওয়া হয়নি',
  };

  useEffect(() => {
    // In a real app, this would fetch stats from a database
    // For demo purposes, we're using placeholder data
    const mockStats = {
      month: {
        ancVisits: 24,
        deliveries: 5,
        immunizations: 18,
        ironTablets: 75, // percentage
        pncCheckups: 80, // percentage
        pregnantWomen: [
          { name: translations.firstTrimester, population: 8, color: '#FF9F40' },
          { name: translations.secondTrimester, population: 12, color: '#4BC0C0' },
          { name: translations.thirdTrimester, population: 6, color: '#36A2EB' },
        ],
        riskCases: [
          { name: translations.highRisk, population: 3, color: '#FF6384' },
          { name: translations.mediumRisk, population: 7, color: '#FFCD56' },
          { name: translations.lowRisk, population: 16, color: '#4BC0C0' },
        ],
        vaccinations: [
          { name: translations.fullyVaccinated, population: 22, color: '#4BC0C0' },
          { name: translations.partiallyVaccinated, population: 8, color: '#FFCD56' },
          { name: translations.notVaccinated, population: 4, color: '#FF6384' },
        ],
        monthlyData: {
          labels: isEnglish ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] : ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
            }
          ]
        }
      }
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  const renderPieChart = (data, title) => {
    if (!data) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

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

  const renderProgressBar = (percentage, title, color) => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>{title}</Text>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: color }
            ]}
          />
        </View>
      </View>
    );
  };

  const renderStatCard = (value, title, icon, color) => {
    return (
      <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
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

        {/* Period Selector */}
        <View style={styles.selectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPeriod === 'week' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedPeriod === 'week' && styles.selectedSelectorButtonText
              ]}>
                {translations.weekly}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPeriod === 'month' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedPeriod === 'month' && styles.selectedSelectorButtonText
              ]}>
                {translations.monthly}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPeriod === 'quarter' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedPeriod('quarter')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedPeriod === 'quarter' && styles.selectedSelectorButtonText
              ]}>
                {translations.quarterly}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPeriod === 'year' && styles.selectedSelectorButton
              ]}
              onPress={() => setSelectedPeriod('year')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedPeriod === 'year' && styles.selectedSelectorButtonText
              ]}>
                {translations.yearly}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>{translations.monthlySummary}</Text>

              <View style={styles.statsGrid}>
                {renderStatCard(
                  stats.month?.ancVisits || 0,
                  translations.ancVisits,
                  'woman',
                  '#4A90E2'
                )}

                {renderStatCard(
                  stats.month?.deliveries || 0,
                  translations.deliveries,
                  'happy',
                  '#FF9500'
                )}

                {renderStatCard(
                  stats.month?.immunizations || 0,
                  translations.immunizations,
                  'medkit',
                  '#34C759'
                )}
              </View>
            </View>

            {/* Progress Bars */}
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>{translations.progress}</Text>

              {renderProgressBar(
                stats.month?.ironTablets || 0,
                translations.ironTablets,
                '#4A90E2'
              )}

              {renderProgressBar(
                stats.month?.pncCheckups || 0,
                translations.pncCheckups,
                '#FF9500'
              )}
            </View>

            {/* Pie Charts */}
            {renderPieChart(
              stats.month?.pregnantWomen,
              translations.pregnantWomenByTrimester
            )}

            {renderPieChart(
              stats.month?.riskCases,
              translations.riskCasesIdentified
            )}

            {renderPieChart(
              stats.month?.vaccinations,
              translations.childrenVaccinationStatus
            )}

            {/* Bar Chart */}
            {renderBarChart(
              stats.month?.monthlyData,
              translations.monthlyTrend
            )}
          </View>
        )}

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
  content: {
    flex: 1,
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
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  languageToggle: {
    marginLeft: 10,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectorButton: {
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
  selectedSelectorButton: {
    backgroundColor: '#4A90E2',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  selectedSelectorButtonText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressContainer: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  bottomNavSpace: {
    height: 90,
  },
});
