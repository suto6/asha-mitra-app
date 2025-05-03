import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage keys
const PATIENTS_STORAGE_KEY = 'asha_mitra_patients';

// Helper function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Add a new patient
export const addPatient = async (patientData) => {
  try {
    // Get existing patients
    const existingPatientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const existingPatients = existingPatientsJson ? JSON.parse(existingPatientsJson) : [];
    
    // Create a new patient object with ID and timestamp
    const newPatient = {
      id: generateId(),
      ...patientData,
      created_at: new Date().toISOString(),
    };
    
    // Add the new patient to the beginning of the array (for recent patients)
    const updatedPatients = [newPatient, ...existingPatients];
    
    // Save the updated patients array
    await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
    
    return { success: true, patient: newPatient };
  } catch (error) {
    console.error('Error adding patient:', error);
    return { success: false, error: error.message };
  }
};

// Get all patients
export const getAllPatients = async () => {
  try {
    const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    
    return { success: true, patients };
  } catch (error) {
    console.error('Error getting patients:', error);
    return { success: false, error: error.message };
  }
};

// Get a patient by ID
export const getPatientById = async (patientId) => {
  try {
    const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    
    const patient = patients.find(p => p.id === patientId);
    
    if (patient) {
      return { success: true, patient };
    } else {
      return { success: false, error: 'Patient not found' };
    }
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    return { success: false, error: error.message };
  }
};

// Search patients by name
export const searchPatientsByName = async (name = '') => {
  try {
    const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    
    if (!name) {
      // If no search term is provided, return all patients (sorted by most recent)
      return { success: true, patients };
    }
    
    // Filter patients by name (case-insensitive)
    const filteredPatients = patients.filter(patient => 
      patient.name && patient.name.toLowerCase().includes(name.toLowerCase())
    );
    
    return { success: true, patients: filteredPatients };
  } catch (error) {
    console.error('Error searching patients:', error);
    return { success: false, error: error.message };
  }
};

// Update a patient
export const updatePatient = async (patientId, updatedData) => {
  try {
    const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) {
      return { success: false, error: 'Patient not found' };
    }
    
    // Update the patient data
    patients[patientIndex] = {
      ...patients[patientIndex],
      ...updatedData,
      updated_at: new Date().toISOString(),
    };
    
    // Save the updated patients array
    await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    
    return { success: true, patient: patients[patientIndex] };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: error.message };
  }
};

// Delete a patient
export const deletePatient = async (patientId) => {
  try {
    const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    
    const updatedPatients = patients.filter(p => p.id !== patientId);
    
    // Save the updated patients array
    await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: error.message };
  }
};
