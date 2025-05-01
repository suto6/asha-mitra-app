import BengaliText from '../constants/BengaliText';
import { speakBengali } from './voiceRecognition';

// Function to analyze health data and detect potential risks
export const analyzeHealthData = (patientData) => {
  const alerts = [];
  
  // Check blood pressure
  if (patientData.bloodPressure) {
    const bpValues = extractBPValues(patientData.bloodPressure);
    
    if (bpValues) {
      const { systolic, diastolic } = bpValues;
      
      // High blood pressure check
      if (systolic > 140 || diastolic > 90) {
        alerts.push({
          type: 'danger',
          message: BengaliText.HIGH_BP,
        });
      }
      
      // Low blood pressure check
      if (systolic < 90 || diastolic < 60) {
        alerts.push({
          type: 'danger',
          message: BengaliText.LOW_BP,
        });
      }
    }
  }
  
  // Check weight (simplified - would be more complex in real implementation)
  if (patientData.weight && parseInt(patientData.weight) < 45) {
    alerts.push({
      type: 'warning',
      message: BengaliText.LOW_WEIGHT,
    });
  }
  
  // Additional checks would be added here based on medical guidelines
  
  return alerts;
};

// Function to extract systolic and diastolic values from BP string
function extractBPValues(bpString) {
  // Handle different formats: "120/80", "১২০/৮০", etc.
  
  // Convert Bengali numerals to Arabic if needed
  const normalizedBP = convertBengaliToArabicNumerals(bpString);
  
  // Extract values using regex
  const bpMatch = normalizedBP.match(/(\d+)[\/\\](\d+)/);
  
  if (bpMatch && bpMatch.length >= 3) {
    return {
      systolic: parseInt(bpMatch[1]),
      diastolic: parseInt(bpMatch[2])
    };
  }
  
  return null;
}

// Function to convert Bengali numerals to Arabic numerals
function convertBengaliToArabicNumerals(text) {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  return text.split('').map(char => {
    const index = bengaliNumerals.indexOf(char);
    return index !== -1 ? index : char;
  }).join('');
}

// Function to display and speak alerts
export const processHealthAlerts = async (alerts) => {
  if (!alerts || alerts.length === 0) return;
  
  // Combine all alert messages
  const alertMessage = alerts.map(alert => alert.message).join(' ');
  
  // Speak the alert in Bengali
  await speakBengali(alertMessage);
  
  // Return the alerts for UI display
  return alerts;
};
