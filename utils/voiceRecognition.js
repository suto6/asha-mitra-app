import * as Speech from 'expo-speech';

// Function to start speech recognition
// Note: For production, we would integrate with Bhashini API for better Bengali support
export const startVoiceRecognition = async (onResult, onError) => {
  try {
    console.log('Starting voice recognition...');

    // Check if we're running in a web environment
    if (typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition)) {

      // Web implementation using Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set language to Bengali (bn-IN)
      recognition.lang = 'bn-IN'; // Bengali

      // Event handlers
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        console.log('Voice recognition result:', result);
        onResult(result);
      };

      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        onError(event.error);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
      };

      // Start recognition
      recognition.start();

      // Return control object
      return {
        start: () => {
          if (recognition) recognition.start();
        },
        stop: () => {
          if (recognition) recognition.stop();
        }
      };
    } else {
      // Fallback for platforms where Web Speech API is not available
      console.warn('Speech Recognition is not available on this platform/browser');

      // Simulate voice recognition with a timeout
      const timeout = setTimeout(() => {
        // For demo purposes, we're returning a hardcoded result
        const mockResult = 'নাম পিঙ্কি বিশ্বাস';
        onResult(mockResult);
      }, 2000);

      // Return control object
      return {
        start: () => {
          console.log('Started listening (simulated)...');
        },
        stop: () => {
          clearTimeout(timeout);
          console.log('Stopped listening (simulated)...');
        }
      };
    }
  } catch (error) {
    console.error('Voice recognition setup error:', error);
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

// Function to parse voice input for search
export const parseVoiceInput = (input) => {
  // Parse voice input to extract field-value pairs
  console.log('Parsing voice input:', input);

  // Check for Bengali name pattern
  if (input.includes('নাম')) {
    const nameMatch = input.match(/নাম\s+(.+?)(\s|$)/);
    if (nameMatch && nameMatch[1]) {
      return { type: 'name', value: nameMatch[1].trim() };
    }
  }

  // Check for English name pattern
  if (input.toLowerCase().includes('name')) {
    const nameMatch = input.match(/name\s+(.+?)(\s|$)/i);
    if (nameMatch && nameMatch[1]) {
      return { type: 'name', value: nameMatch[1].trim() };
    }
  }

  // Check for Bengali phone pattern
  if (input.includes('ফোন')) {
    const phoneMatch = input.match(/ফোন\s+(.+?)(\s|$)/);
    if (phoneMatch && phoneMatch[1]) {
      return { type: 'phone', value: phoneMatch[1].trim() };
    }
  }

  // Check for English phone pattern
  if (input.toLowerCase().includes('phone')) {
    const phoneMatch = input.match(/phone\s+(.+?)(\s|$)/i);
    if (phoneMatch && phoneMatch[1]) {
      return { type: 'phone', value: phoneMatch[1].trim() };
    }
  }

  // Default to treating the whole input as a name search
  return { type: 'name', value: input.trim() };
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
