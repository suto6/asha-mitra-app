import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';

import BengaliText from '@/constants/BengaliText';
import BottomNavBar from '@/components/BottomNavBar';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedArea, setSelectedArea] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

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
          { name: '1st Trimester', population: 8, color: '#FF9F40' },
          { name: '2nd Trimester', population: 12, color: '#4BC0C0' },
          { name: '3rd Trimester', population: 6, color: '#36A2EB' },
        ],
        riskCases: [
          { name: 'High Risk', population: 3, color: '#FF6384' },
          { name: 'Medium Risk', population: 7, color: '#FFCD56' },
          { name: 'Low Risk', population: 16, color: '#4BC0C0' },
        ],
        vaccinations: [
          { name: 'Fully Vaccinated', population: 22, color: '#4BC0C0' },
          { name: 'Partially Vaccinated', population: 8, color: '#FFCD56' },
          { name: 'Not Vaccinated', population: 4, color: '#FF6384' },
        ],
        monthlyData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
          <Text style={styles.headerTitle}>{BengaliText.REPORTS}</Text>
          <Text style={styles.headerSubtitle}>Monthly Statistics</Text>
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
                Weekly
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
                Monthly
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
                Quarterly
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
                Yearly
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
                All Areas
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
                North Village
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
                South Village
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
                East Village
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading statistics...</Text>
          </View>
        ) : (
          <View style={styles.statsContainer}>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Monthly Summary</Text>
              
              <View style={styles.statsGrid}>
                {renderStatCard(
                  stats.month?.ancVisits || 0,
                  'ANC Visits',
                  'woman',
                  '#4A90E2'
                )}
                
                {renderStatCard(
                  stats.month?.deliveries || 0,
                  'Deliveries',
                  'happy',
                  '#FF9500'
                )}
                
                {renderStatCard(
                  stats.month?.immunizations || 0,
                  'Immunizations',
                  'medkit',
                  '#34C759'
                )}
              </View>
            </View>
            
            {/* Progress Bars */}
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Progress</Text>
              
              {renderProgressBar(
                stats.month?.ironTablets || 0,
                'Iron Tablets Given',
                '#4A90E2'
              )}
              
              {renderProgressBar(
                stats.month?.pncCheckups || 0,
                'PNC Checkups Completed',
                '#FF9500'
              )}
            </View>
            
            {/* Pie Charts */}
            {renderPieChart(
              stats.month?.pregnantWomen,
              'Pregnant Women by Trimester'
            )}
            
            {renderPieChart(
              stats.month?.riskCases,
              'Risk Cases Identified'
            )}
            
            {renderPieChart(
              stats.month?.vaccinations,
              'Children Vaccination Status'
            )}
            
            {/* Bar Chart */}
            {renderBarChart(
              stats.month?.monthlyData,
              'Monthly Trend'
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
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
