import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
  style?: object;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ style }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={toggleLanguage}
      activeOpacity={0.7}
    >
      <View style={styles.toggleContainer}>
        <View style={[
          styles.languageOption, 
          language === 'bn' && styles.activeLanguage
        ]}>
          <Text style={[
            styles.languageText, 
            language === 'bn' && styles.activeLanguageText
          ]}>
            বাংলা
          </Text>
        </View>
        <View style={[
          styles.languageOption, 
          language === 'en' && styles.activeLanguage
        ]}>
          <Text style={[
            styles.languageText, 
            language === 'en' && styles.activeLanguageText
          ]}>
            EN
          </Text>
        </View>
      </View>
      <Ionicons name="language" size={16} color="#666666" style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  activeLanguage: {
    backgroundColor: '#4A90E2',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeLanguageText: {
    color: '#FFFFFF',
  },
  icon: {
    marginLeft: 4,
  },
});

export default LanguageToggle;
