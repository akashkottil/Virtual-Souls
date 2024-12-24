import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqK_axqhDEhgHGwv9NcZUGt9iGyTkGONg",
    authDomain: "aichatapp-e7c78.firebaseapp.com",
    projectId: "aichatapp-e7c78",
    storageBucket: "aichatapp-e7c78.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:758232109197:android:7da9c3607a0f40e28e52c4",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, storage, db };