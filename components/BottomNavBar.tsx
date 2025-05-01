import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/')}>
        <Ionicons name="home" size={24} color="#555" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/stats')}>
        <Ionicons name="stats-chart" size={24} color="#555" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Add action')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/notifications')}>
        <Ionicons name="heart" size={24} color="#555" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile')}>
        <Ionicons name="person" size={24} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default BottomNavBar;
