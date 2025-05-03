import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ style }) => {
  const { isEnglish, toggleLanguage } = useLanguage();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          isEnglish ? styles.inactiveButton : styles.activeButton
        ]}
        onPress={!isEnglish ? null : toggleLanguage}
      >
        <Text
          style={[
            styles.toggleText,
            isEnglish ? styles.inactiveText : styles.activeText
          ]}
        >
          বাংলা
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          isEnglish ? styles.activeButton : styles.inactiveButton
        ]}
        onPress={isEnglish ? null : toggleLanguage}
      >
        <Text
          style={[
            styles.toggleText,
            isEnglish ? styles.activeText : styles.inactiveText
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: '#89CFF0', // Baby blue color
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#666666',
  },
});

export default LanguageToggle;
