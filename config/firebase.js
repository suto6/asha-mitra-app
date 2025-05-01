// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAcCPq4joA4xZ0tlTiCzNxvpupG4eFzoQ",
  authDomain: "ashamitra-9c05d.firebaseapp.com",
  projectId: "ashamitra-9c05d",
  storageBucket: "ashamitra-9c05d.firebasestorage.app",
  messagingSenderId: "571157843070",
  appId: "1:571157843070:web:d4878cd27e64404465dc2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with persistence (for Expo)
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

// Firestore
const db = getFirestore(app);

// export { app, auth, db };
export { app, db };
