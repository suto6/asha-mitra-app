import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BengaliText from '../constants/BengaliText';
import { useLanguage } from '../contexts/LanguageContext';

// Voice input button with recording state indicators
const VoiceInputButton = ({
  onStartRecording,
  onStopRecording,
  isRecording = false,
  isProcessing = false,
  style
}) => {
  const { isEnglish } = useLanguage();
  const handlePress = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRecording ? styles.recordingButton : {},
        style
      ]}
      onPress={handlePress}
      disabled={isProcessing}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {isProcessing ? (
          <>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.buttonText}>{isEnglish ? "Processing..." : BengaliText.PROCESSING}</Text>
          </>
        ) : (
          <>
            <Ionicons
              name={isRecording ? "mic" : "mic-outline"}
              size={32}
              color="#FFFFFF"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>
              {isRecording
                ? (isEnglish ? "Stop Recording" : BengaliText.STOP_RECORDING)
                : (isEnglish ? "Start Recording" : BengaliText.START_RECORDING)}
            </Text>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Text style={styles.recordingText}>{isEnglish ? "Listening..." : BengaliText.LISTENING}</Text>
                <View style={styles.pulsatingDot} />
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    minWidth: 250,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  pulsatingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
});

export default VoiceInputButton;
