import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import { speakBengali } from '@/utils/voiceRecognition';

export default function VoiceHelpScreen() {
  const [activeSection, setActiveSection] = useState(null);

  const helpSections = [
    {
      id: '1',
      title: 'ভয়েস ইনপুট কিভাবে ব্যবহার করবেন',
      content: 'পেশেন্টের তথ্য যোগ করার সময় আপনি ভয়েস ইনপুট ব্যবহার করতে পারেন। মাইক বাটনে ক্লিক করুন এবং পেশেন্টের তথ্য বলুন। উদাহরণ: "পেশেন্টের নাম পিঙ্কি বিশ্বাস, বয়স ২৫ বছর, শেষ মাসিকের তারিখ ১০ মে ২০২৩, ওজন ৫৫ কেজি, উচ্চতা ১৫৫ সেমি, ব্লাড প্রেসার ১২০/৮০"',
      icon: 'mic',
    },
    {
      id: '2',
      title: 'পেশেন্ট খোঁজার জন্য ভয়েস ব্যবহার',
      content: 'পেশেন্ট খোঁজার জন্য আপনি ভয়েস ব্যবহার করতে পারেন। সার্চ পেজে গিয়ে মাইক বাটনে ক্লিক করুন এবং পেশেন্টের নাম বলুন। উদাহরণ: "পিঙ্কি বিশ্বাস খুঁজুন" বা "সুমিতা রায় খুঁজুন"',
      icon: 'search',
    },
    {
      id: '3',
      title: 'স্বাস্থ্য রেকর্ড যোগ করার জন্য ভয়েস ব্যবহার',
      content: 'পেশেন্টের স্বাস্থ্য রেকর্ড যোগ করার সময় আপনি ভয়েস ব্যবহার করতে পারেন। মাইক বাটনে ক্লিক করুন এবং স্বাস্থ্য তথ্য বলুন। উদাহরণ: "ওজন ৫৫ কেজি, ব্লাড প্রেসার ১২০/৮০, গর্ভাবস্থা ৬ মাস, কোন সমস্যা নেই"',
      icon: 'document-text',
    },
    {
      id: '4',
      title: 'ভয়েস কমান্ড',
      content: 'আপনি নিম্নলিখিত ভয়েস কমান্ড ব্যবহার করতে পারেন:\n\n• "নতুন পেশেন্ট যোগ করুন" - নতুন পেশেন্ট যোগ করার পেজে যাবে\n• "পেশেন্ট খুঁজুন" - পেশেন্ট খোঁজার পেজে যাবে\n• "আজকের অ্যাপয়েন্টমেন্ট দেখুন" - আজকের অ্যাপয়েন্টমেন্ট দেখাবে\n• "ঝুঁকির সতর্কতা দেখুন" - ঝুঁকির সতর্কতা পেজে যাবে',
      icon: 'list',
    },
    {
      id: '5',
      title: 'ভয়েস ইনপুট টিপস',
      content: '• স্পষ্ট এবং ধীরে কথা বলুন\n• শব্দের মাঝে ছোট বিরতি দিন\n• শব্দ শেষ হওয়ার পর কিছুক্ষণ অপেক্ষা করুন\n• যদি ভয়েস ইনপুট সঠিকভাবে কাজ না করে, আবার চেষ্টা করুন\n• শান্ত পরিবেশে ভয়েস ইনপুট ব্যবহার করুন',
      icon: 'information-circle',
    },
  ];

  const handleSectionPress = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const handlePlayVoice = (text) => {
    speakBengali(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>{BengaliText.VOICE_HELP}</Text>
            <View style={styles.placeholderView} />
          </View>
        </View>

        {/* Voice Help Intro */}
        <View style={styles.introContainer}>
          <Image 
            // source={require('@/assets/images/voice-help.png')} 
            style={styles.introImage}
            resizeMode="contain"
          />
          <Text style={styles.introTitle}>ভয়েস সহায়তা</Text>
          <Text style={styles.introText}>
            এই অ্যাপে আপনি ভয়েস ব্যবহার করে বিভিন্ন কাজ করতে পারেন। নিচে ভয়েস ব্যবহারের নির্দেশিকা দেওয়া আছে।
          </Text>
        </View>

        {/* Help Sections */}
        <View style={styles.sectionsContainer}>
          {helpSections.map((section) => (
            <View key={section.id} style={styles.sectionCard}>
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => handleSectionPress(section.id)}
              >
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionIconContainer}>
                    <Ionicons name={section.icon} size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <Ionicons 
                  name={activeSection === section.id ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#666666" 
                />
              </TouchableOpacity>
              
              {activeSection === section.id && (
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionText}>{section.content}</Text>
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => handlePlayVoice(section.content)}
                  >
                    <Ionicons name="volume-high" size={20} color="#FFFFFF" />
                    <Text style={styles.playButtonText}>শুনুন</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Practice Section */}
        <View style={styles.practiceContainer}>
          <Text style={styles.practiceTitle}>অনুশীলন করুন</Text>
          <Text style={styles.practiceText}>
            নিচের বাটনে ক্লিক করে ভয়েস ইনপুট অনুশীলন করুন।
          </Text>
          
          <TouchableOpacity 
            style={styles.practiceMicButton}
            onPress={() => router.push('/(tabs)/add-patient')}
          >
            <Ionicons name="mic" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.practiceHint}>
            মাইক বাটনে ক্লিক করে কথা বলুন
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholderView: {
    width: 40,
  },
  
  // Intro Styles
  introContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  introImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Sections Styles
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sectionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  
  // Practice Styles
  practiceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  practiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  practiceText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  practiceMicButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  practiceHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
