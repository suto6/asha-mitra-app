import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HealthDataCardProps {
  title: string;
  target: number;
  consumed: number;
  remaining: number;
  color: string;
}

const HealthDataCard = ({ title, target, consumed, remaining, color }: HealthDataCardProps) => {
  // Calculate percentage for progress circle
  const percentage = Math.min(Math.round((consumed / target) * 100), 100);
  
  return (
    <View style={[styles.card, { backgroundColor: `${color}20` }]}>
      <View style={styles.cardContent}>
        <View style={styles.dataColumn}>
          <View style={styles.dataItem}>
            <View style={[styles.colorDot, { backgroundColor: color }]} />
            <Text style={styles.dataLabel}>{target} ক্যালোরি</Text>
            <Text style={styles.dataSubLabel}>লক্ষ্য</Text>
          </View>
          
          <View style={styles.dataItem}>
            <View style={[styles.colorDot, { backgroundColor: '#FFB347' }]} />
            <Text style={styles.dataLabel}>{consumed} ক্যালোরি</Text>
            <Text style={styles.dataSubLabel}>গ্রহণ করা</Text>
          </View>
          
          <View style={styles.dataItem}>
            <View style={[styles.colorDot, { backgroundColor: '#A9A9A9' }]} />
            <Text style={styles.dataLabel}>{remaining} ক্যালোরি</Text>
            <Text style={styles.dataSubLabel}>অবশিষ্ট</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <View style={styles.progressBackground} />
            <View 
              style={[
                styles.progressFill, 
                { 
                  borderColor: color,
                  transform: [{ rotate: `${percentage * 3.6}deg` }] 
                }
              ]} 
            />
            <View style={styles.progressCenter}>
              <Text style={styles.progressText}>{consumed}</Text>
              <Text style={styles.progressSubText}>ক্যালোরি</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.seeStatsText}>পরিসংখ্যান দেখুন</Text>
        <Ionicons name="chevron-forward" size={16} color="#555" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dataColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  dataSubLabel: {
    fontSize: 12,
    color: '#777',
  },
  progressContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#E0E0E0',
  },
  progressFill: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  progressCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSubText: {
    fontSize: 12,
    color: '#777',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  seeStatsText: {
    fontSize: 14,
    color: '#555',
    marginRight: 4,
  },
});

export default HealthDataCard;
