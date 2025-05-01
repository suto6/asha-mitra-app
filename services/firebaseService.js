import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  signOut
} from 'firebase/auth';
import { auth, db } from '../config/firebase';

// Authentication Functions

// Function to send OTP to phone number
export const sendOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    return { success: true, verificationId };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error.message };
  }
};

// Function to verify OTP and sign in
export const verifyOTP = async (verificationId, otp) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await signInWithCredential(auth, credential);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message };
  }
};

// Function to sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

// ASHA Worker Functions

// Function to create or update ASHA worker profile
export const saveAshaWorkerProfile = async (userId, profileData) => {
  try {
    const ashaWorkerRef = doc(db, 'asha_kormi', userId);
    await setDoc(ashaWorkerRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving ASHA worker profile:', error);
    return { success: false, error: error.message };
  }
};

// Function to get ASHA worker profile
export const getAshaWorkerProfile = async (userId) => {
  try {
    const ashaWorkerRef = doc(db, 'asha_kormi', userId);
    const ashaWorkerSnap = await getDoc(ashaWorkerRef);
    
    if (ashaWorkerSnap.exists()) {
      return { success: true, profile: ashaWorkerSnap.data() };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error) {
    console.error('Error getting ASHA worker profile:', error);
    return { success: false, error: error.message };
  }
};

// Patient Functions

// Function to add a new patient
export const addPatient = async (patientData, ashaWorkerId) => {
  try {
    // Add patient to patients collection
    const patientRef = await addDoc(collection(db, 'patients'), {
      ...patientData,
      recorded_by_asha_id: ashaWorkerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Add initial health record
    await addHealthRecord(patientRef.id, patientData, ashaWorkerId);
    
    return { success: true, patientId: patientRef.id };
  } catch (error) {
    console.error('Error adding patient:', error);
    return { success: false, error: error.message };
  }
};

// Function to search patients by name
export const searchPatientsByName = async (name) => {
  try {
    // Query patients collection where name field contains the search term
    // Note: This is a simple implementation. In production, we would use
    // a more sophisticated search mechanism for Bengali text
    const patientsQuery = query(
      collection(db, 'patients'),
      where('name', '>=', name),
      where('name', '<=', name + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(patientsQuery);
    const patients = [];
    
    querySnapshot.forEach((doc) => {
      patients.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, patients };
  } catch (error) {
    console.error('Error searching patients:', error);
    return { success: false, error: error.message };
  }
};

// Function to get patient details
export const getPatientDetails = async (patientId) => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    const patientSnap = await getDoc(patientRef);
    
    if (patientSnap.exists()) {
      return { success: true, patient: patientSnap.data() };
    } else {
      return { success: false, error: 'Patient not found' };
    }
  } catch (error) {
    console.error('Error getting patient details:', error);
    return { success: false, error: error.message };
  }
};

// Health Record Functions

// Function to add a health record
export const addHealthRecord = async (patientId, healthData, ashaWorkerId) => {
  try {
    const healthRecordRef = await addDoc(
      collection(db, 'patients', patientId, 'health_records'),
      {
        lmp_date: healthData.lmpDate || null,
        weight_kg: healthData.weight || null,
        height_cm: healthData.height || null,
        blood_pressure: healthData.bloodPressure || null,
        notes: healthData.notes || null,
        recorded_by_asha_id: ashaWorkerId,
        timestamp: serverTimestamp()
      }
    );
    
    return { success: true, recordId: healthRecordRef.id };
  } catch (error) {
    console.error('Error adding health record:', error);
    return { success: false, error: error.message };
  }
};

// Function to get patient health records
export const getPatientHealthRecords = async (patientId) => {
  try {
    const recordsQuery = query(
      collection(db, 'patients', patientId, 'health_records'),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(recordsQuery);
    const records = [];
    
    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, records };
  } catch (error) {
    console.error('Error getting health records:', error);
    return { success: false, error: error.message };
  }
};
