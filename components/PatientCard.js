import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BengaliText from '../constants/BengaliText';

// Card component for displaying patient information
const PatientCard = ({ patient, onPress }) => {
  // Generate a color based on the patient name for the avatar
  const getAvatarColor = (name) => {
    const colors = ['#4A90E2', '#FF9500', '#4CD964', '#FF3B30', '#8E5D9F', '#5AC8FA'];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const avatarColor = getAvatarColor(patient.name);
  const nameInitial = patient.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.avatarContainer, { backgroundColor: `${avatarColor}20` }]}>
        <Text style={[styles.avatarText, { color: avatarColor }]}>{nameInitial}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{patient.name}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{BengaliText.AGE}:</Text>
            <Text style={styles.detailValue}>{patient.age}</Text>
          </View>
          {patient.lmpDate && (
            <>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{BengaliText.LMP_DATE}:</Text>
                <Text style={styles.detailValue}>{patient.lmpDate}</Text>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.actionContainer}>
        <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888888',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  detailDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 8,
  },
  actionContainer: {
    padding: 4,
  },
});

export default PatientCard;
