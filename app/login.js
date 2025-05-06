import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';

/**
 * Redirect component that sends users to the login page
 * This file ensures that when users navigate to /login, they are redirected to the actual login page
 */
export default function LoginRedirect() {
  useEffect(() => {
    // Redirect to the actual login page in the (auth) group
    router.replace('/(auth)/login');
  }, []);

  // Show a loading indicator while redirecting
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A90E2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
