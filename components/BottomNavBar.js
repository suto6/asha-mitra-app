import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNavBar = () => {
  const pathname = usePathname();
  const { isEnglish } = useLanguage();

  const tabs = [
    {
      name: isEnglish ? 'Dashboard' : 'ড্যাশবোর্ড',
      icon: 'home-outline',
      activeIcon: 'home',
      path: '/(tabs)',
    },
    {
      name: isEnglish ? 'Stats' : 'পরিসংখ্যান',
      icon: 'stats-chart-outline',
      activeIcon: 'stats-chart',
      path: '/stats',
    },
    {
      name: isEnglish ? 'Add' : 'যোগ করুন',
      icon: 'add-circle-outline',
      activeIcon: 'add-circle',
      path: '/add',
    },
    {
      name: isEnglish ? 'Search' : 'অনুসন্ধান',
      icon: 'search-outline',
      activeIcon: 'search',
      path: '/search',
    },
    {
      name: isEnglish ? 'Profile' : 'প্রোফাইল',
      icon: 'person-outline',
      activeIcon: 'person',
      path: '/profile',
    },
  ];

  const isActive = (path) => {
    if (path === '/(tabs)' && pathname === '/(tabs)') return true;
    return pathname === path;
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.path}
          style={styles.tab}
          onPress={() => router.push(tab.path)}
        >
          <Ionicons
            name={isActive(tab.path) ? tab.activeIcon : tab.icon}
            size={24}
            color={isActive(tab.path) ? '#89CFF0' : '#666666'}
          />
          <Text
            style={[
              styles.tabText,
              isActive(tab.path) && styles.activeTabText,
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666666',
  },
  activeTabText: {
    color: '#89CFF0',
    fontWeight: 'bold',
  },
});

export default BottomNavBar;
