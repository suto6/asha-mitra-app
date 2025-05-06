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

// Function to add an appointment
export const addAppointment = async (appointmentData) => {
  try {
    // Validate required fields
    if (!appointmentData.patientId || !appointmentData.date || !appointmentData.time) {
      throw new Error('Patient ID, date, and time are required');
    }

    // Get patient details to include in the appointment
    const patientResult = await localStorageService.getPatientById(appointmentData.patientId);

    if (!patientResult.success) {
      throw new Error(patientResult.error);
    }

    // Create appointment data with patient details
    const appointment = {
      patientId: appointmentData.patientId,
      patientName: patientResult.patient.name,
      patientType: patientResult.patient.type || 'general',
      appointmentType: appointmentData.appointmentType || 'checkup',
      date: appointmentData.date,
      time: appointmentData.time,
      notes: appointmentData.notes || '',
    };

    // Add the appointment
    const result = await localStorageService.addAppointment(appointment);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      appointmentId: result.appointment.id,
      appointment: result.appointment
    };
  } catch (error) {
    console.error('Add appointment error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get all appointments
export const getAllAppointments = async () => {
  try {
    const result = await localStorageService.getAllAppointments();

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      appointments: result.appointments
    };
  } catch (error) {
    console.error('Get all appointments error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get appointments by date
export const getAppointmentsByDate = async (date) => {
  try {
    const result = await localStorageService.getAppointmentsByDate(date);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      appointments: result.appointments
    };
  } catch (error) {
    console.error('Get appointments by date error:', error);
    return { success: false, error: error.message };
  }
};

// Function to delete an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const result = await localStorageService.deleteAppointment(appointmentId);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Delete appointment error:', error);
    return { success: false, error: error.message };
  }
};

// Function to toggle appointment completion status
export const toggleAppointmentCompletion = async (appointmentId) => {
  try {
    const result = await localStorageService.toggleAppointmentCompletion(appointmentId);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      appointment: result.appointment,
      completed: result.completed
    };
  } catch (error) {
    console.error('Toggle appointment completion error:', error);
    return { success: false, error: error.message };
  }
};

// Function to delete a patient
export const deletePatient = async (patientId) => {
  try {
    console.log('patientService.deletePatient called with ID:', patientId);

    if (!patientId) {
      console.error('Invalid patient ID:', patientId);
      return { success: false, error: 'Invalid patient ID' };
    }

    // Convert patientId to string to ensure consistent handling
    const patientIdStr = String(patientId);
    console.log('Using patient ID (as string):', patientIdStr);

    const result = await localStorageService.deletePatient(patientIdStr);
    console.log('localStorageService.deletePatient result:', result);

    if (!result.success) {
      console.error('localStorageService.deletePatient failed:', result.error);
      throw new Error(result.error);
    }

    console.log('Patient deleted successfully');
    return {
      success: true
    };
  } catch (error) {
    console.error('Delete patient error:', error);
    return { success: false, error: error.message };
  }
};
