import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

const BottomNavBar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [activeTab, setActiveTab] = useState('');

  // Animation values for the active indicator
  const [animations] = useState({
    home: new Animated.Value(0),
    stats: new Animated.Value(0),
    add: new Animated.Value(0),
    notifications: new Animated.Value(0),
    profile: new Animated.Value(0),
  });

  // Update active tab based on current path
  useEffect(() => {
    let tab = '';
    if (currentPath.includes('dashboard')) {
      tab = 'home';
    } else if (currentPath.includes('stats') || currentPath.includes('index')) {
      tab = 'stats';
    } else if (currentPath.includes('add-patient')) {
      tab = 'add';
    } else if (currentPath.includes('notifications')) {
      tab = 'notifications';
    } else if (currentPath.includes('profile')) {
      tab = 'profile';
    }

    setActiveTab(tab);

    // Animate the active indicator
    Object.keys(animations).forEach(key => {
      Animated.timing(animations[key], {
        toValue: key === tab ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [currentPath]);

  const handlePress = (path: string, tab: string) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path);
  };

  const getTabColor = (tab: string) => {
    return activeTab === tab ? '#4A90E2' : '#9E9E9E';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePress('/(tabs)/dashboard', 'home')}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.iconBackground,
              {
                opacity: animations.home,
                transform: [{ scale: animations.home.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                }) }]
              }
            ]}
          />
          <Ionicons name="home" size={24} color={getTabColor('home')} />
          <Text style={[styles.tabLabel, { color: getTabColor('home') }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePress('/(tabs)/index', 'stats')}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.iconBackground,
              {
                opacity: animations.stats,
                transform: [{ scale: animations.stats.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                }) }]
              }
            ]}
          />
          <Ionicons name="stats-chart" size={24} color={getTabColor('stats')} />
          <Text style={[styles.tabLabel, { color: getTabColor('stats') }]}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={() => handlePress('/(tabs)/add-patient', 'add')}
          activeOpacity={0.9}
        >
          <View style={styles.actionButton}>
            <Ionicons name="add" size={28} color="#FFF" />
          </View>
          <Text style={styles.actionLabel}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePress('/(tabs)/search-patient', 'notifications')}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.iconBackground,
              {
                opacity: animations.notifications,
                transform: [{ scale: animations.notifications.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                }) }]
              }
            ]}
          />
          <Ionicons name="search" size={24} color={getTabColor('notifications')} />
          <Text style={[styles.tabLabel, { color: getTabColor('notifications') }]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePress('/profile', 'profile')}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.iconBackground,
              {
                opacity: animations.profile,
                transform: [{ scale: animations.profile.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                }) }]
              }
            ]}
          />
          <Ionicons name="person" size={24} color={getTabColor('profile')} />
          <Text style={[styles.tabLabel, { color: getTabColor('profile') }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    position: 'relative',
  },
  iconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    top: 0,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  actionButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  actionLabel: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default BottomNavBar;
