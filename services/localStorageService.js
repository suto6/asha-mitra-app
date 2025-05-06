import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage keys
const PATIENTS_STORAGE_KEY = 'asha_mitra_patients';
const APPOINTMENTS_STORAGE_KEY = 'asha_mitra_appointments';

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
    console.log('localStorageService.deletePatient called with ID:', patientId);

    if (!patientId) {
      console.error('Invalid patient ID:', patientId);
      return { success: false, error: 'Invalid patient ID' };
    }

    // Convert patientId to string to ensure consistent comparison
    const patientIdStr = String(patientId);
    console.log('Using patient ID (as string):', patientIdStr);

    const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    console.log('Retrieved patients from storage');

    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    console.log('Total patients before deletion:', patients.length);
    console.log('Patient IDs before deletion:', patients.map(p => p.id));

    // Check if patient exists (comparing as strings)
    const patientExists = patients.some(p => String(p.id) === patientIdStr);
    console.log('Patient exists:', patientExists);

    if (!patientExists) {
      console.error('Patient not found with ID:', patientIdStr);
      return { success: false, error: 'Patient not found' };
    }

    // Filter out the patient with the matching ID (comparing as strings)
    const updatedPatients = patients.filter(p => String(p.id) !== patientIdStr);
    console.log('Total patients after deletion:', updatedPatients.length);

    // Save the updated patients array
    await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
    console.log('Updated patients saved to storage');

    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: error.message };
  }
};

// Add a new appointment
export const addAppointment = async (appointmentData) => {
  try {
    // Get existing appointments
    const existingAppointmentsJson = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const existingAppointments = existingAppointmentsJson ? JSON.parse(existingAppointmentsJson) : [];

    // Create a new appointment object with ID and timestamp
    const newAppointment = {
      id: generateId(),
      ...appointmentData,
      completed: false, // Default to not completed
      created_at: new Date().toISOString(),
    };

    // Add the new appointment to the array
    const updatedAppointments = [...existingAppointments, newAppointment];

    // Save the updated appointments array
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));

    return { success: true, appointment: newAppointment };
  } catch (error) {
    console.error('Error adding appointment:', error);
    return { success: false, error: error.message };
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const appointmentsJson = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const appointments = appointmentsJson ? JSON.parse(appointmentsJson) : [];

    return { success: true, appointments };
  } catch (error) {
    console.error('Error getting appointments:', error);
    return { success: false, error: error.message };
  }
};

// Get appointments by date
export const getAppointmentsByDate = async (date) => {
  try {
    const appointmentsJson = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const appointments = appointmentsJson ? JSON.parse(appointmentsJson) : [];

    console.log('LocalStorage - All appointments:', appointments.length);
    console.log('LocalStorage - Looking for date:', date);
    console.log('LocalStorage - All appointment dates:', appointments.map(a => a.date));

    // Filter appointments by date
    const filteredAppointments = appointments.filter(appointment =>
      appointment.date === date
    );

    console.log('LocalStorage - Filtered appointments:', filteredAppointments.length);

    return { success: true, appointments: filteredAppointments };
  } catch (error) {
    console.error('Error getting appointments by date:', error);
    return { success: false, error: error.message };
  }
};

// Delete an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentsJson = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const appointments = appointmentsJson ? JSON.parse(appointmentsJson) : [];

    const updatedAppointments = appointments.filter(a => a.id !== appointmentId);

    // Save the updated appointments array
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));

    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: error.message };
  }
};

// Toggle appointment completion status
export const toggleAppointmentCompletion = async (appointmentId) => {
  try {
    const appointmentsJson = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const appointments = appointmentsJson ? JSON.parse(appointmentsJson) : [];

    // Find the appointment and toggle its completion status
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          completed: !appointment.completed
        };
      }
      return appointment;
    });

    // Save the updated appointments array
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));

    // Find the updated appointment to return
    const updatedAppointment = updatedAppointments.find(a => a.id === appointmentId);

    return {
      success: true,
      appointment: updatedAppointment,
      completed: updatedAppointment ? updatedAppointment.completed : false
    };
  } catch (error) {
    console.error('Error toggling appointment completion:', error);
    return { success: false, error: error.message };
  }
};
