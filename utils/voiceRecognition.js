import * as Speech from 'expo-speech';

// Function to start speech recognition (using Expo Speech)
// Note: For production, we would integrate with Bhashini API for better Bengali support
export const startVoiceRecognition = async (onResult, onError) => {
  try {
    // This is a placeholder for actual voice recognition
    // In a real implementation, we would use Bhashini API or a more robust Bengali STT solution
    
    // For demo purposes, we're using Expo Speech which has limited Bengali support
    // This would be replaced with actual Bengali speech recognition in production
    
    // Simulate voice recognition process
    return {
      start: () => {
        // Start listening logic would go here
        console.log('Started listening...');
      },
      stop: () => {
        // Stop listening logic would go here
        console.log('Stopped listening...');
      }
    };
  } catch (error) {
    onError(error);
    return null;
  }
};

// Function to speak text in Bengali
export const speakBengali = async (text) => {
  try {
    // Check if Bengali voice is available
    const voices = await Speech.getAvailableVoicesAsync();
    const bengaliVoice = voices.find(voice => 
      voice.language.includes('bn') || voice.language.includes('ben')
    );
    
    const options = bengaliVoice 
      ? { language: bengaliVoice.language, voice: bengaliVoice.identifier }
      : { language: 'bn-IN' }; // Fallback to generic Bengali
    
    await Speech.speak(text, options);
    return true;
  } catch (error) {
    console.error('Error speaking Bengali:', error);
    return false;
  }
};

// Function to parse patient data from Bengali voice input
export const parsePatientData = (bengaliText) => {
  // This is a simplified parser for demonstration
  // In a real implementation, we would use NLP or a more robust parsing solution
  
  // Example parsing logic for Bengali text
  const data = {
    name: extractValue(bengaliText, 'পেশেন্টের নাম', 'বয়স'),
    age: extractNumericValue(bengaliText, 'বয়স', 'বছর'),
    lmpDate: extractDateValue(bengaliText, 'শেষ মাসিকের তারিখ'),
    weight: extractNumericValue(bengaliText, 'ওজন', 'কেজি'),
    height: extractValue(bengaliText, 'উচ্চতা', 'ব্লাড প্রেসার'),
    bloodPressure: extractValue(bengaliText, 'ব্লাড প্রেসার', 'বিশেষ'),
    notes: extractValue(bengaliText, 'বিশেষ', '।'),
  };
  
  return data;
};

// Helper function to extract values between keywords
function extractValue(text, startKeyword, endKeyword) {
  try {
    const startIndex = text.indexOf(startKeyword);
    if (startIndex === -1) return '';
    
    const valueStartIndex = startIndex + startKeyword.length;
    const endIndex = endKeyword ? text.indexOf(endKeyword, valueStartIndex) : text.length;
    
    if (endIndex === -1) return text.substring(valueStartIndex).trim();
    return text.substring(valueStartIndex, endIndex).trim();
  } catch (error) {
    console.error('Error extracting value:', error);
    return '';
  }
}

// Helper function to extract numeric values
function extractNumericValue(text, keyword, unit) {
  const value = extractValue(text, keyword, unit);
  const numericMatch = value.match(/\d+/);
  return numericMatch ? numericMatch[0] : '';
}

// Helper function to extract date values
function extractDateValue(text, keyword) {
  // This is a simplified date extraction
  // In a real implementation, we would handle various Bengali date formats
  const dateValue = extractValue(text, keyword, 'ওজন');
  
  // For demo purposes, returning a placeholder date
  // In production, we would parse Bengali date formats properly
  return dateValue || new Date().toISOString().split('T')[0];
}
