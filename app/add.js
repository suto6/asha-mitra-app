import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BengaliText from '@/constants/BengaliText';
import BottomNavBar from '@/components/BottomNavBar';
import BengaliTextInput from '@/components/BengaliTextInput';
import BengaliButton from '@/components/BengaliButton';
import VoiceInputButton from '@/components/VoiceInputButton';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AddScreen() {
  const [activeTab, setActiveTab] = useState('pregnant');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isEnglish } = useLanguage();

  // Text translations
  const translations = {
    addNewEntry: isEnglish ? 'Add New Entry' : 'নতুন এন্ট্রি যোগ করুন',
    pregnant: isEnglish ? 'Pregnant' : 'গর্ভবতী',
    postnatal: isEnglish ? 'Postnatal' : 'প্রসবোত্তর',
    child: isEnglish ? 'Child' : 'শিশু',
    speakNow: isEnglish ? 'Speak Now' : BengaliText.SPEAK_NOW,
    voiceInfo: isEnglish ? 'Provide information using voice' : 'তথ্য ভয়েস দিয়ে দিন',
    name: isEnglish ? 'Name' : 'নাম',
    enterName: isEnglish ? 'Enter name' : 'নাম লিখুন',
    age: isEnglish ? 'Age' : 'বয়স',
    phone: isEnglish ? 'Phone Number' : 'ফোন নম্বর',
    lmpDate: isEnglish ? 'Last Menstrual Period (LMP)' : 'শেষ মাসিকের তারিখ (LMP)',
    eddDate: isEnglish ? 'Expected Delivery Date (EDD)' : 'সম্ভাব্য প্রসবের তারিখ (EDD)',
    autoCalculated: isEnglish ? 'Auto calculated' : 'স্বয়ংক্রিয় গণনা',
    weight: isEnglish ? 'Weight (kg)' : 'ওজন (কেজি)',
    height: isEnglish ? 'Height (cm)' : 'উচ্চতা (সেমি)',
    bloodPressure: isEnglish ? 'Blood Pressure' : 'ব্লাড প্রেসার',
    bpExample: isEnglish ? 'Example: 120/80' : 'উদাহরণ: 120/80',
    highRiskPregnancy: isEnglish ? 'High Risk Pregnancy' : 'উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থা',
    notes: isEnglish ? 'Special Notes / Issues' : 'বিশেষ নোট / সমস্যা',
    save: isEnglish ? 'Save' : 'সংরক্ষণ করুন',
    setReminder: isEnglish ? 'Set reminder for next ANC visit' : 'পরবর্তী ANC পরিদর্শনের রিমাইন্ডার সেট করুন',
    motherName: isEnglish ? 'Mother\'s Name' : 'মায়ের নাম',
    deliveryDate: isEnglish ? 'Delivery Date' : 'প্রসবের তারিখ',
    deliveryType: isEnglish ? 'Delivery Type:' : 'প্রসবের ধরন:',
    normal: isEnglish ? 'Normal' : 'স্বাভাবিক',
    cesarean: isEnglish ? 'Cesarean' : 'সিজারিয়ান',
    babyWeight: isEnglish ? 'Baby\'s Weight (kg)' : 'শিশুর ওজন (কেজি)',
    motherWeight: isEnglish ? 'Mother\'s Weight (kg)' : 'মায়ের ওজন (কেজি)',
    setPncReminder: isEnglish ? 'Set reminder for next PNC visit' : 'পরবর্তী PNC পরিদর্শনের রিমাইন্ডার সেট করুন',
    childName: isEnglish ? 'Child\'s Name' : 'শিশুর নাম',
    dateOfBirth: isEnglish ? 'Date of Birth' : 'জন্ম তারিখ',
    gender: isEnglish ? 'Gender:' : 'লিঙ্গ:',
    boy: isEnglish ? 'Boy' : 'ছেলে',
    girl: isEnglish ? 'Girl' : 'মেয়ে',
    immunizationStatus: isEnglish ? 'Immunization Status:' : 'টিকাদান স্ট্যাটাস:',
    selectStatus: isEnglish ? 'Select immunization status' : 'টিকাদান স্ট্যাটাস নির্বাচন করুন',
    setImmunizationReminder: isEnglish ? 'Set reminder for next immunization' : 'পরবর্তী টিকাদানের রিমাইন্ডার সেট করুন',
    pregnantInfo: isEnglish ? 'pregnant woman\'s information' : 'গর্ভবতী মহিলার তথ্য',
    postnatalInfo: isEnglish ? 'postnatal information' : 'প্রসবোত্তর তথ্য',
    childInfo: isEnglish ? 'child\'s information' : 'শিশুর তথ্য',
  };

  // Form data states
  const [pregnantData, setPregnantData] = useState({
    name: '',
    age: '',
    phone: '',
    lmpDate: '',
    eddDate: '',
    weight: '',
    height: '',
    bloodPressure: '',
    isHighRisk: false,
    notes: '',
  });

  const [postnatalData, setPostnatalData] = useState({
    motherName: '',
    age: '',
    phone: '',
    deliveryDate: '',
    deliveryType: 'normal',
    babyWeight: '',
    motherWeight: '',
    bloodPressure: '',
    notes: '',
  });

  const [childData, setChildData] = useState({
    name: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
    height: '',
    immunizationStatus: '',
    notes: '',
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, this would start voice recognition
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);

      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);

        // Populate form based on active tab
        if (activeTab === 'pregnant') {
          setPregnantData({
            ...pregnantData,
            name: 'পিঙ্কি বিশ্বাস',
            age: '25',
            phone: '9876543210',
            lmpDate: '২০২৩-০৪-০১',
          });
        } else if (activeTab === 'postnatal') {
          setPostnatalData({
            ...postnatalData,
            motherName: 'সুমিতা রায়',
            age: '22',
            phone: '9876543211',
            deliveryDate: '২০২৩-০৫-১০',
          });
        } else if (activeTab === 'child') {
          setChildData({
            ...childData,
            name: 'অনিতা দাস',
            motherName: 'রিতা দাস',
            dateOfBirth: '২০২৩-০৫-০১',
            gender: 'মেয়ে',
          });
        }
      }, 2000);
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, this would stop voice recognition
  };

  const handleSave = () => {
    setSaving(true);

    // Simulate saving
    setTimeout(() => {
      setSaving(false);

      // Reset form based on active tab
      if (activeTab === 'pregnant') {
        setPregnantData({
          name: '',
          age: '',
          phone: '',
          lmpDate: '',
          eddDate: '',
          weight: '',
          height: '',
          bloodPressure: '',
          isHighRisk: false,
          notes: '',
        });
      } else if (activeTab === 'postnatal') {
        setPostnatalData({
          motherName: '',
          age: '',
          phone: '',
          deliveryDate: '',
          deliveryType: 'normal',
          babyWeight: '',
          motherWeight: '',
          bloodPressure: '',
          notes: '',
        });
      } else if (activeTab === 'child') {
        setChildData({
          name: '',
          motherName: '',
          dateOfBirth: '',
          gender: '',
          weight: '',
          height: '',
          immunizationStatus: '',
          notes: '',
        });
      }

      // Show success message (in a real app)
      alert('Data saved successfully!');
    }, 1500);
  };

  const calculateEDD = (lmpDate) => {
    // This is a placeholder for calculating EDD from LMP
    // In a real app, this would use a proper date calculation
    return 'Calculated EDD will appear here';
  };

  const renderPregnantWomenForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label="নাম"
          value={pregnantData.name}
          onChangeText={(text) => setPregnantData({...pregnantData, name: text})}
          placeholder="নাম লিখুন"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="বয়স"
              value={pregnantData.age}
              onChangeText={(text) => setPregnantData({...pregnantData, age: text})}
              placeholder="বয়স"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ফোন নম্বর"
              value={pregnantData.phone}
              onChangeText={(text) => setPregnantData({...pregnantData, phone: text})}
              placeholder="ফোন নম্বর"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="শেষ মাসিকের তারিখ (LMP)"
              value={pregnantData.lmpDate}
              onChangeText={(text) => {
                const newData = {...pregnantData, lmpDate: text};
                newData.eddDate = calculateEDD(text);
                setPregnantData(newData);
              }}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="সম্ভাব্য প্রসবের তারিখ (EDD)"
              value={pregnantData.eddDate}
              editable={false}
              placeholder="স্বয়ংক্রিয় গণনা"
            />
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ওজন (কেজি)"
              value={pregnantData.weight}
              onChangeText={(text) => setPregnantData({...pregnantData, weight: text})}
              placeholder="ওজন"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="উচ্চতা (সেমি)"
              value={pregnantData.height}
              onChangeText={(text) => setPregnantData({...pregnantData, height: text})}
              placeholder="উচ্চতা"
              keyboardType="numeric"
            />
          </View>
        </View>

        <BengaliTextInput
          label="ব্লাড প্রেসার"
          value={pregnantData.bloodPressure}
          onChangeText={(text) => setPregnantData({...pregnantData, bloodPressure: text})}
          placeholder="উদাহরণ: 120/80"
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setPregnantData({...pregnantData, isHighRisk: !pregnantData.isHighRisk})}
          >
            <View style={[
              styles.checkboxInner,
              pregnantData.isHighRisk && styles.checkboxChecked
            ]}>
              {pregnantData.isHighRisk && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থা</Text>
        </View>

        <BengaliTextInput
          label="বিশেষ নোট / সমস্যা"
          value={pregnantData.notes}
          onChangeText={(text) => setPregnantData({...pregnantData, notes: text})}
          placeholder="বিশেষ নোট / সমস্যা"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title="সংরক্ষণ করুন"
            onPress={handleSave}
            loading={saving}
            disabled={!pregnantData.name || !pregnantData.age}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => alert('Reminder set for next ANC visit')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>পরবর্তী ANC পরিদর্শনের রিমাইন্ডার সেট করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPostnatalForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label="মায়ের নাম"
          value={postnatalData.motherName}
          onChangeText={(text) => setPostnatalData({...postnatalData, motherName: text})}
          placeholder="মায়ের নাম লিখুন"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="বয়স"
              value={postnatalData.age}
              onChangeText={(text) => setPostnatalData({...postnatalData, age: text})}
              placeholder="বয়স"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ফোন নম্বর"
              value={postnatalData.phone}
              onChangeText={(text) => setPostnatalData({...postnatalData, phone: text})}
              placeholder="ফোন নম্বর"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <BengaliTextInput
          label="প্রসবের তারিখ"
          value={postnatalData.deliveryDate}
          onChangeText={(text) => setPostnatalData({...postnatalData, deliveryDate: text})}
          placeholder="YYYY-MM-DD"
        />

        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>প্রসবের ধরন:</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPostnatalData({...postnatalData, deliveryType: 'normal'})}
            >
              <View style={[
                styles.radioButton,
                postnatalData.deliveryType === 'normal' && styles.radioButtonSelected
              ]}>
                {postnatalData.deliveryType === 'normal' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioText}>স্বাভাবিক</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPostnatalData({...postnatalData, deliveryType: 'cesarean'})}
            >
              <View style={[
                styles.radioButton,
                postnatalData.deliveryType === 'cesarean' && styles.radioButtonSelected
              ]}>
                {postnatalData.deliveryType === 'cesarean' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioText}>সিজারিয়ান</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="শিশুর ওজন (কেজি)"
              value={postnatalData.babyWeight}
              onChangeText={(text) => setPostnatalData({...postnatalData, babyWeight: text})}
              placeholder="শিশুর ওজন"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="মায়ের ওজন (কেজি)"
              value={postnatalData.motherWeight}
              onChangeText={(text) => setPostnatalData({...postnatalData, motherWeight: text})}
              placeholder="মায়ের ওজন"
              keyboardType="numeric"
            />
          </View>
        </View>

        <BengaliTextInput
          label="ব্লাড প্রেসার"
          value={postnatalData.bloodPressure}
          onChangeText={(text) => setPostnatalData({...postnatalData, bloodPressure: text})}
          placeholder="উদাহরণ: 120/80"
        />

        <BengaliTextInput
          label="বিশেষ নোট / সমস্যা"
          value={postnatalData.notes}
          onChangeText={(text) => setPostnatalData({...postnatalData, notes: text})}
          placeholder="বিশেষ নোট / সমস্যা"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title="সংরক্ষণ করুন"
            onPress={handleSave}
            loading={saving}
            disabled={!postnatalData.motherName || !postnatalData.deliveryDate}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => alert('Reminder set for next PNC visit')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>পরবর্তী PNC পরিদর্শনের রিমাইন্ডার সেট করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderChildForm = () => {
    return (
      <View style={styles.formContainer}>
        <BengaliTextInput
          label="শিশুর নাম"
          value={childData.name}
          onChangeText={(text) => setChildData({...childData, name: text})}
          placeholder="শিশুর নাম লিখুন"
        />

        <BengaliTextInput
          label="মায়ের নাম"
          value={childData.motherName}
          onChangeText={(text) => setChildData({...childData, motherName: text})}
          placeholder="মায়ের নাম লিখুন"
        />

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="জন্ম তারিখ"
              value={childData.dateOfBirth}
              onChangeText={(text) => setChildData({...childData, dateOfBirth: text})}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.halfField}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioLabel}>লিঙ্গ:</Text>
              <View style={styles.radioOptions}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setChildData({...childData, gender: 'ছেলে'})}
                >
                  <View style={[
                    styles.radioButton,
                    childData.gender === 'ছেলে' && styles.radioButtonSelected
                  ]}>
                    {childData.gender === 'ছেলে' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>ছেলে</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setChildData({...childData, gender: 'মেয়ে'})}
                >
                  <View style={[
                    styles.radioButton,
                    childData.gender === 'মেয়ে' && styles.radioButtonSelected
                  ]}>
                    {childData.gender === 'মেয়ে' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>মেয়ে</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="ওজন (কেজি)"
              value={childData.weight}
              onChangeText={(text) => setChildData({...childData, weight: text})}
              placeholder="ওজন"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <BengaliTextInput
              label="উচ্চতা (সেমি)"
              value={childData.height}
              onChangeText={(text) => setChildData({...childData, height: text})}
              placeholder="উচ্চতা"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>টিকাদান স্ট্যাটাস:</Text>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => alert('Show dropdown options')}
            >
              <Text style={styles.dropdownButtonText}>
                {childData.immunizationStatus || 'টিকাদান স্ট্যাটাস নির্বাচন করুন'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <BengaliTextInput
          label="বিশেষ নোট / সমস্যা"
          value={childData.notes}
          onChangeText={(text) => setChildData({...childData, notes: text})}
          placeholder="বিশেষ নোট / সমস্যা"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <BengaliButton
            title="সংরক্ষণ করুন"
            onPress={handleSave}
            loading={saving}
            disabled={!childData.name || !childData.dateOfBirth}
          />

          <View style={styles.reminderContainer}>
            <TouchableOpacity
              style={styles.reminderButton}
              onPress={() => alert('Reminder set for next immunization')}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A90E2" />
              <Text style={styles.reminderText}>পরবর্তী টিকাদানের রিমাইন্ডার সেট করুন</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{translations.addNewEntry}</Text>
            <LanguageToggle style={styles.languageToggle} />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pregnant' && styles.activeTab]}
            onPress={() => setActiveTab('pregnant')}
          >
            <Ionicons
              name="woman"
              size={24}
              color={activeTab === 'pregnant' ? '#4A90E2' : '#666666'}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'pregnant' && styles.activeTabText
            ]}>
              {translations.pregnant}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'postnatal' && styles.activeTab]}
            onPress={() => setActiveTab('postnatal')}
          >
            <Ionicons
              name="happy"
              size={24}
              color={activeTab === 'postnatal' ? '#FF9500' : '#666666'}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'postnatal' && styles.activeTabText
            ]}>
              {translations.postnatal}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'child' && styles.activeTab]}
            onPress={() => setActiveTab('child')}
          >
            <Ionicons
              name="body"
              size={24}
              color={activeTab === 'child' ? '#34C759' : '#666666'}
            />
            <Text style={[
              styles.tabText,
              activeTab === 'child' && styles.activeTabText
            ]}>
              {translations.child}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Voice Input Section */}
        <View style={styles.voiceSection}>
          <Text style={styles.voiceTitle}>{translations.speakNow}</Text>
          <Text style={styles.voiceSubtitle}>
            {activeTab === 'pregnant' ? translations.pregnantInfo :
             activeTab === 'postnatal' ? translations.postnatalInfo : translations.childInfo} {translations.voiceInfo}
          </Text>

          <View style={styles.voiceInputContainer}>
            <VoiceInputButton
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              isRecording={isRecording}
              isProcessing={isProcessing}
            />
          </View>
        </View>

        {/* Form based on active tab */}
        {activeTab === 'pregnant' && renderPregnantWomenForm()}
        {activeTab === 'postnatal' && renderPostnatalForm()}
        {activeTab === 'child' && renderChildForm()}

        {/* Extra space for bottom nav */}
        <View style={styles.bottomNavSpace} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  languageToggle: {
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#F0F7FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginTop: 4,
  },
  activeTabText: {
    color: '#4A90E2',
  },
  voiceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  voiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  voiceSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  voiceInputContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A90E2',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    marginTop: 20,
  },
  reminderContainer: {
    marginTop: 16,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 8,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  radioOptions: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#4A90E2',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
  },
  radioText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  bottomNavSpace: {
    height: 90,
  },
});
