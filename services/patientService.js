import * as localStorageService from './localStorageService';

// Function to add a new patient
export const addPatient = async (patientData, userId) => {
  try {
    // Use local storage service to add patient
    const result = await localStorageService.addPatient(patientData);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      patientId: result.patient.id,
      patient: result.patient
    };
  } catch (error) {
    console.error('Add patient error:', error);
    return { success: false, error: error.message };
  }
};

// Function to search patients by name
export const searchPatientsByName = async (name = '') => {
  try {
    // Use local storage service to search patients
    const result = await localStorageService.searchPatientsByName(name);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Process the data to match the expected format
    const patients = result.patients.map(patient => {
      return {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        phone: patient.phone,
        type: patient.type,
        lmpDate: patient.lmpDate,
        created_at: patient.created_at,
        updated_at: patient.updated_at
      };
    });

    return {
      success: true,
      patients
    };
  } catch (error) {
    console.error('Search patients error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get patient details
export const getPatientDetails = async (patientId) => {
  try {
    // Use local storage service to get patient details
    const result = await localStorageService.getPatientById(patientId);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      patient: result.patient
    };
  } catch (error) {
    console.error('Get patient details error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get patient health records
export const getPatientHealthRecords = async (patientId) => {
  try {
    // Use local storage service to get patient details (which includes health records)
    const result = await localStorageService.getPatientById(patientId);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Extract health-related fields as records
    const records = [
      {
        id: '1',
        patient_id: patientId,
        lmp_date: result.patient.lmpDate,
        weight_kg: result.patient.weight,
        height_cm: result.patient.height,
        blood_pressure: result.patient.bloodPressure,
        notes: result.patient.notes,
        timestamp: result.patient.created_at
      }
    ];

    return {
      success: true,
      records
    };
  } catch (error) {
    console.error('Get health records error:', error);
    return { success: false, error: error.message };
  }
};

// Function to add a health record
export const addHealthRecord = async (patientId, recordData) => {
  try {
    // Get the patient first
    const patientResult = await localStorageService.getPatientById(patientId);

    if (!patientResult.success) {
      throw new Error(patientResult.error);
    }

    // Update the patient with new health record data
    const updateData = {
      lmpDate: recordData.lmpDate,
      weight: recordData.weight,
      height: recordData.height,
      bloodPressure: recordData.bloodPressure,
      notes: recordData.notes,
      updated_at: new Date().toISOString()
    };

    const updateResult = await localStorageService.updatePatient(patientId, updateData);

    if (!updateResult.success) {
      throw new Error(updateResult.error);
    }

    // Create a record object to return
    const record = {
      id: Date.now().toString(),
      patient_id: patientId,
      lmp_date: recordData.lmpDate,
      weight_kg: recordData.weight,
      height_cm: recordData.height,
      blood_pressure: recordData.bloodPressure,
      notes: recordData.notes,
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      recordId: record.id,
      record
    };
  } catch (error) {
    console.error('Add health record error:', error);
    return { success: false, error: error.message };
  }
};
