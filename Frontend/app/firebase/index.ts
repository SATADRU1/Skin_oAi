import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged as _onAuthStateChanged,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signOut as _signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkgxug0fdKvcS8ZJwD3TfYabfUxasWHaY",
  authDomain: "my-login-95c33.firebaseapp.com",
  projectId: "my-login-95c33",
  storageBucket: "my-login-95c33.firebasestorage.app",
  messagingSenderId: "425531427167",
  appId: "1:425531427167:web:6ea79ba9e46c4958ae0eea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return _onAuthStateChanged(auth, callback);
};

export const signInWithEmailAndPassword = (email: string, password: string) => {
  return _signInWithEmailAndPassword(auth, email, password);
};

export const createUserWithEmailAndPassword = (email: string, password: string) => {
  return _createUserWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return _signOut(auth);
};

// Firestore helpers
export { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  User 
};
