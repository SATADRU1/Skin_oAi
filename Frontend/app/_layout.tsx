import React from 'react';
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScanProvider } from '@/contexts/ScanContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, onAuthStateChanged, User } from '../app/firebase';
import { signIn, signUp, signOutUser, getUserData } from '../services/authService';

SplashScreen.preventAutoHideAsync();

// Authentication context type
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  userData: any | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userData: null,
  login: async () => ({ success: false, error: 'Not implemented' }),
  register: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => {},
  loading: true,
});

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        
        // Fetch additional user data from Firestore
        const fetchUserData = async () => {
          try {
            const userDoc = await getUserData(user.uid);
            setUserData(userDoc);
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            setLoading(false);
          }
        };
        
        fetchUserData();
      } else {
        setUser(null);
        setUserData(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, error } = await signIn(email, password);
      
      if (error || !user) {
        return { success: false, error: error || 'Failed to sign in' };
      }
      
      // User is now signed in and auth state will be updated by the onAuthStateChanged listener
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Failed to login' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const { user, error } = await signUp(email, password, userData);
      
      if (error || !user) {
        return { success: false, error: error || 'Failed to register' };
      }
      
      // User is now registered and signed in, auth state will be updated by the onAuthStateChanged listener
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Failed to register' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    userData,
    login,
    register,
    logout,
    loading,
  };

  // Check if user is already authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Auth state is already handled by the onAuthStateChanged listener
        console.log('Auth check completed');
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="result" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Add a small delay to ensure the splash screen is properly hidden
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <ScanProvider>
        <AppContent />
        <StatusBar style="light" />
      </ScanProvider>
    </ThemeProvider>
  );
}
