import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BengaliText from '../constants/BengaliText';

// Card component for displaying patient information
const PatientCard = ({ patient, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="person" size={32} color="#4A90E2" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{patient.name}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{BengaliText.AGE}</Text>
            <Text style={styles.detailValue}>{patient.age} {BengaliText.AGE}</Text>
          </View>
          {patient.lmpDate && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{BengaliText.LMP_DATE}</Text>
              <Text style={styles.detailValue}>{patient.lmpDate}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    marginRight: 16,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888888',
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
  },
});

export default PatientCard;
