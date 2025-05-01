import { Tabs, router } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import BottomNavBar from '@/components/BottomNavBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { default as BengaliText } from '@/constants/BengaliText';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // Hide the default tab bar since we're using our custom BottomNavBar
        tabBarStyle: { display: 'none' },
      }}
      tabBar={() => <BottomNavBar />}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: BengaliText.HOME,
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="stats-chart" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-patient"
        options={{
          title: BengaliText.ADD_PATIENT,
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="person-add" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search-patient"
        options={{
          title: BengaliText.SEARCH_PATIENT,
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="search" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
