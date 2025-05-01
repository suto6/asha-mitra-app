import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';

export default function ReportsScreen() {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    // In a real implementation, we would fetch reports from a database
    // For demo purposes, we're using placeholder data
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const currentMonth = new Date().getMonth();
    
    setSelectedMonth(months[currentMonth]);
    
    const mockReports = {
      [months[currentMonth]]: {
        pregnancies: 12,
        deliveries: 5,
        immunizations: 18,
        ancVisits: 24,
        newborns: 5,
        highRiskCases: 3,
      },
      [months[currentMonth - 1 >= 0 ? currentMonth - 1 : 11]]: {
        pregnancies: 10,
        deliveries: 4,
        immunizations: 15,
        ancVisits: 20,
        newborns: 4,
        highRiskCases: 2,
      },
    };
    
    setReports(mockReports);
    setLoading(false);
  }, []);

  const renderMonthSelector = () => {
    const months = Object.keys(reports);
    
    return (
      <View style={styles.monthSelectorContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsScrollContent}
        >
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthButton,
                selectedMonth === month && styles.selectedMonthButton
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[
                styles.monthButtonText,
                selectedMonth === month && styles.selectedMonthButtonText
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderStatCard = (title, value, icon, color) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>{BengaliText.REPORTS}</Text>
            <View style={styles.placeholderView} />
          </View>
        </View>

        {/* Month Selector */}
        {renderMonthSelector()}

        {/* Reports Content */}
        <View style={styles.reportsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
            </View>
          ) : reports[selectedMonth] ? (
            <>
              <Text style={styles.monthTitle}>
                {selectedMonth} {BengaliText.THIS_MONTH}
              </Text>
              
              <View style={styles.statsGrid}>
                {renderStatCard(
                  BengaliText.PREGNANCIES,
                  reports[selectedMonth].pregnancies,
                  'woman',
                  '#4A90E2'
                )}
                
                {renderStatCard(
                  BengaliText.DELIVERIES,
                  reports[selectedMonth].deliveries,
                  'happy',
                  '#FF9500'
                )}
                
                {renderStatCard(
                  BengaliText.IMMUNIZATIONS_DONE,
                  reports[selectedMonth].immunizations,
                  'medkit',
                  '#34C759'
                )}
                
                {renderStatCard(
                  BengaliText.ANC_VISITS,
                  reports[selectedMonth].ancVisits,
                  'calendar',
                  '#5856D6'
                )}
                
                {renderStatCard(
                  BengaliText.NEWBORN,
                  reports[selectedMonth].newborns,
                  'body',
                  '#FF3B30'
                )}
                
                {renderStatCard(
                  BengaliText.RISK_ALERTS,
                  reports[selectedMonth].highRiskCases,
                  'warning',
                  '#FF2D55'
                )}
              </View>
              
              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>সারাংশ</Text>
                <Text style={styles.summaryText}>
                  {selectedMonth} মাসে আপনি {reports[selectedMonth].pregnancies} জন গর্ভবতী মহিলার পরিচর্যা করেছেন, {reports[selectedMonth].deliveries} টি প্রসব সম্পন্ন হয়েছে, এবং {reports[selectedMonth].immunizations} টি টিকাদান সম্পন্ন করেছেন। আপনি {reports[selectedMonth].ancVisits} টি ANC পরিদর্শন করেছেন।
                </Text>
                
                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download" size={20} color="#FFFFFF" />
                  <Text style={styles.downloadButtonText}>রিপোর্ট ডাউনলোড করুন</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyText}>
                এই মাসের জন্য কোন রিপোর্ট নেই
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: '#34C759',
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
  
  // Month Selector Styles
  monthSelectorContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  monthsScrollContent: {
    paddingHorizontal: 20,
  },
  monthButton: {
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
  selectedMonthButton: {
    backgroundColor: '#34C759',
  },
  monthButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  selectedMonthButtonText: {
    color: '#FFFFFF',
  },
  
  // Reports Styles
  reportsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#888888',
    marginTop: 16,
    textAlign: 'center',
  },
  
  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
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
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666666',
  },
  
  // Summary Card Styles
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
