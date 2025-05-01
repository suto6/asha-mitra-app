import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';

export default function RiskAlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would fetch risk alerts from a database
    // For demo purposes, we're using placeholder data
    const mockAlerts = [
      {
        id: '1',
        patientId: '1',
        patientName: 'পিঙ্কি বিশ্বাস',
        patientType: 'pregnant',
        alertType: 'high-bp',
        message: BengaliText.HIGH_BP,
        date: '২০২৩-০৫-১০',
        severity: 'high',
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'সুমিতা রায়',
        patientType: 'pregnant',
        alertType: 'low-weight',
        message: BengaliText.LOW_WEIGHT,
        date: '২০২৩-০৫-০৮',
        severity: 'medium',
      },
      {
        id: '3',
        patientId: '3',
        patientName: 'অনিতা দাস',
        patientType: 'newborn',
        alertType: 'missed-visit',
        message: 'টিকাদান মিস করেছেন। যোগাযোগ করুন।',
        date: '২০২৩-০৫-১২',
        severity: 'medium',
      },
    ];
    
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  const handleSelectAlert = (patientId) => {
    router.push({
      pathname: '/patient/[id]',
      params: { id: patientId }
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#4A90E2';
    }
  };

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.alertCard}
      onPress={() => handleSelectAlert(item.patientId)}
      activeOpacity={0.7}
    >
      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(item.severity) }]} />
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.alertDate}>{item.date}</Text>
        </View>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <View style={styles.alertFooter}>
          <View style={styles.patientTypeTag}>
            <Text style={styles.patientTypeText}>
              {item.patientType === 'pregnant' ? BengaliText.PREGNANT :
               item.patientType === 'newborn' ? BengaliText.NEWBORN :
               BengaliText.CHILD}
            </Text>
          </View>
          <Text style={styles.viewDetailsText}>বিস্তারিত দেখুন</Text>
        </View>
      </View>
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
            <Text style={styles.title}>{BengaliText.RISK_ALERTS}</Text>
            <View style={styles.placeholderView} />
          </View>
        </View>

        {/* Alerts List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            {alerts.length} টি সতর্কতা পাওয়া গেছে
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
            </View>
          ) : alerts.length > 0 ? (
            <FlatList
              data={alerts}
              keyExtractor={(item) => item.id}
              renderItem={renderAlertItem}
              contentContainerStyle={styles.alertsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#34C759" />
              <Text style={styles.emptyText}>
                কোন সতর্কতা নেই
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
    backgroundColor: '#FF3B30',
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
  
  // List Styles
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  alertsList: {
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
  
  // Alert Card Styles
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  severityIndicator: {
    width: 8,
    height: '100%',
  },
  alertContent: {
    flex: 1,
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  alertDate: {
    fontSize: 14,
    color: '#888888',
  },
  alertMessage: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 22,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
  },
  patientTypeText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#4A90E2',
  },
});
