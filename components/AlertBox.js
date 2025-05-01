import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BengaliText from '../constants/BengaliText';

// Alert box for displaying health warnings
const AlertBox = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      {alerts.map((alert, index) => (
        <View 
          key={index} 
          style={[
            styles.alertBox,
            alert.type === 'danger' ? styles.dangerAlert : styles.warningAlert
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={alert.type === 'danger' ? "warning" : "information-circle"} 
              size={28} 
              color={alert.type === 'danger' ? "#FFFFFF" : "#FFFFFF"} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.alertTitle}>
              {BengaliText.DANGER_ALERT}
            </Text>
            <Text style={styles.alertMessage}>
              {alert.message}
            </Text>
          </View>
          {onDismiss && (
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => onDismiss(index)}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
  },
  alertBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerAlert: {
    backgroundColor: '#FF3B30',
  },
  warningAlert: {
    backgroundColor: '#FF9500',
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  closeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlertBox;
