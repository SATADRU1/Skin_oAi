import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  User
} from '../app/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  email: string;
  displayName?: string;
  // Add other user fields as needed
}

export const signUp = async (email: string, password: string, userData: Omit<UserData, 'email'>) => {
  try {
    console.log('Attempting to create user with email:', email);
    
    // Create the user account first
    const userCredential = await createUserWithEmailAndPassword(email, password);
    const { user } = userCredential;
    
    if (user) {
      console.log('User account created successfully:', user.uid);
      
      try {
        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          ...userData,
          createdAt: serverTimestamp(),
          uid: user.uid, // Add UID for reference
        });
        console.log('User data saved to Firestore successfully');
      } catch (firestoreError: any) {
        console.error('Error saving user data to Firestore:', firestoreError);
        // Even if Firestore fails, the user account is created
        // We can continue with the signup process
      }

      // Save token to AsyncStorage
      try {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('authToken', token);
        console.log('Auth token saved to AsyncStorage');
      } catch (tokenError) {
        console.error('Error saving auth token:', tokenError);
        // Continue even if token saving fails
      }
      
      return { user, error: null };
    }
    
    return { user: null, error: 'User creation failed' };
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    // Provide more user-friendly error messages
    let errorMessage = error.message || 'Failed to create account';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists. Please sign in instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters long';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password accounts are not enabled. Please contact support.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in with email:', email);
    
    // Basic validation
    if (!email || !password) {
      console.error('Email and password are required');
      return { user: null, error: 'Email and password are required' };
    }
    
    // Clear any existing auth state
    if (auth.currentUser) {
      console.log('User already signed in, signing out first');
      await firebaseSignOut();
    }
    
    const userCredential = await signInWithEmailAndPassword(email, password);
    const { user } = userCredential;
    
    if (user) {
      console.log('User signed in successfully:', user.uid);
      
      // Save token to AsyncStorage
      try {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('authToken', token);
        console.log('Auth token saved to AsyncStorage');
      } catch (tokenError) {
        console.error('Error saving auth token:', tokenError);
        // Continue even if token saving fails
      }
      
      return { user, error: null };
    }
    
    console.error('No user returned from sign in');
    return { user: null, error: 'Failed to sign in: No user returned' };
  } catch (error: any) {
    console.error('Sign in error details:', {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    // Provide more user-friendly error messages
    let errorMessage = error.message || 'Failed to sign in';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please create an account first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please check your credentials.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled. Please contact support.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const signOutUser = async () => {
  try {
    await firebaseSignOut();
    await AsyncStorage.removeItem('authToken');
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
