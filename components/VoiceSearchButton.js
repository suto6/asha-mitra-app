import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

// Voice search button with recording state indicators
const VoiceSearchButton = ({
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
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording ? styles.recordingButton : {},
        ]}
        onPress={handlePress}
        disabled={isProcessing}
        activeOpacity={0.7}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons
            name={isRecording ? "mic" : "mic-outline"}
            size={20}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>
      <Text style={styles.buttonText}>
        {isProcessing 
          ? (isEnglish ? "Processing..." : "প্রসেসিং...")
          : isRecording 
            ? (isEnglish ? "Listening..." : "শুনছে...")
            : (isEnglish ? "Voice" : "ভয়েস")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default VoiceSearchButton;
