import { supabase } from '../lib/supabase';

// Function to add a new patient
export const addPatient = async (patientData, userId) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Create patient record
    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          name: patientData.name,
          age: patientData.age,
          type: patientData.type || 'general',
          phone: patientData.phone || null,
          recorded_by_asha_id: user.id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // If health record data is provided, create a health record
    if (patientData.lmpDate || patientData.weight || patientData.height || 
        patientData.bloodPressure || patientData.notes) {
      
      const healthRecord = {
        patient_id: data.id,
        lmp_date: patientData.lmpDate,
        weight_kg: patientData.weight,
        height_cm: patientData.height,
        blood_pressure: patientData.bloodPressure,
        notes: patientData.notes,
        recorded_by_asha_id: user.id
      };
      
      const { error: healthError } = await supabase
        .from('health_records')
        .insert([healthRecord]);
      
      if (healthError) throw healthError;
    }
    
    return { 
      success: true, 
      patientId: data.id,
      patient: data
    };
  } catch (error) {
    console.error('Add patient error:', error);
    return { success: false, error: error.message };
  }
};

// Function to search patients by name
export const searchPatientsByName = async (name = '') => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) return { success: false, error: 'No user logged in' };
    
    let query = supabase
      .from('patients')
      .select('*, health_records(*)')
      .eq('recorded_by_asha_id', user.id)
      .order('created_at', { ascending: false });
    
    // Add name filter if provided
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    
    // Limit to 10 results if no name is provided (recent patients)
    if (!name) {
      query = query.limit(10);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Process the data to match the expected format
    const patients = data.map(patient => {
      const lastRecord = patient.health_records && patient.health_records.length > 0
        ? patient.health_records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
        : null;
      
      return {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        phone: patient.phone,
        type: patient.type,
        recorded_by_asha_id: patient.recorded_by_asha_id,
        created_at: patient.created_at,
        updated_at: patient.updated_at,
        last_record: lastRecord
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Get patient record
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('recorded_by_asha_id', user.id)
      .single();
    
    if (error) throw error;
    
    return { 
      success: true, 
      patient: data
    };
  } catch (error) {
    console.error('Get patient details error:', error);
    return { success: false, error: error.message };
  }
};

// Function to get patient health records
export const getPatientHealthRecords = async (patientId) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Get health records
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return { 
      success: true, 
      records: data
    };
  } catch (error) {
    console.error('Get health records error:', error);
    return { success: false, error: error.message };
  }
};

// Function to add a health record
export const addHealthRecord = async (patientId, recordData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Create health record
    const healthRecord = {
      patient_id: patientId,
      lmp_date: recordData.lmpDate,
      weight_kg: recordData.weight,
      height_cm: recordData.height,
      blood_pressure: recordData.bloodPressure,
      notes: recordData.notes,
      recorded_by_asha_id: user.id
    };
    
    const { data, error } = await supabase
      .from('health_records')
      .insert([healthRecord])
      .select()
      .single();
    
    if (error) throw error;
    
    return { 
      success: true, 
      recordId: data.id,
      record: data
    };
  } catch (error) {
    console.error('Add health record error:', error);
    return { success: false, error: error.message };
  }
};
