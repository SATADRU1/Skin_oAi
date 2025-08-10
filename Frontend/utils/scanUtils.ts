import { ScanResult, ScanStats } from '@/types/scan';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCANS_STORAGE_KEY = 'skinAnalysisScans';

// Generate UUID
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Format date and time
export const formatDateTime = (date: Date): { date: string; time: string } => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes} ${ampm}`
  };
};

// Calculate statistics from scan results
export const calculateStats = (scans: ScanResult[]): ScanStats => {
  if (scans.length === 0) {
    return {
      totalScans: 0,
      averageAccuracy: 0,
      healthScore: 'A+',
      healthyCount: 0,
    };
  }

  const totalScans = scans.length;
  const averageAccuracy = Math.round(
    scans.reduce((sum, scan) => sum + scan.accuracy, 0) / totalScans
  );
  
  const healthyCount = scans.filter(scan => scan.severity === 'None').length;
  const healthyPercentage = (healthyCount / totalScans) * 100;
  
  // Calculate health score based on healthy percentage and average accuracy
  let healthScore = 'F';
  if (healthyPercentage >= 90 && averageAccuracy >= 95) healthScore = 'A+';
  else if (healthyPercentage >= 80 && averageAccuracy >= 90) healthScore = 'A';
  else if (healthyPercentage >= 70 && averageAccuracy >= 85) healthScore = 'B+';
  else if (healthyPercentage >= 60 && averageAccuracy >= 80) healthScore = 'B';
  else if (healthyPercentage >= 50 && averageAccuracy >= 75) healthScore = 'C+';
  else if (healthyPercentage >= 40 && averageAccuracy >= 70) healthScore = 'C';
  else if (healthyPercentage >= 30) healthScore = 'D';

  return {
    totalScans,
    averageAccuracy,
    healthScore,
    healthyCount,
  };
};

// Storage functions
export const saveScansToStorage = async (scans: ScanResult[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(scans));
  } catch (error) {
    console.error('Error saving scans to storage:', error);
    throw error;
  }
};

export const loadScansFromStorage = async (): Promise<ScanResult[]> => {
  try {
    const scansJson = await AsyncStorage.getItem(SCANS_STORAGE_KEY);
    if (scansJson) {
      return JSON.parse(scansJson);
    }
    return [];
  } catch (error) {
    console.error('Error loading scans from storage:', error);
    return [];
  }
};

// Get recent scans (limit to last 4 for home screen)
export const getRecentScans = (scans: ScanResult[], limit: number = 4): ScanResult[] => {
  return scans
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
};

// Generate mock scan result for testing
export const generateMockScan = (): Omit<ScanResult, 'id' | 'createdAt'> => {
  const conditions = ['Melanoma', 'Dry Skin', 'Normal Skin', 'Skin Rashes', 'Acne', 'Eczema'];
  const severities: Array<'None' | 'Mild' | 'Moderate' | 'Severe'> = ['None', 'Mild', 'Moderate', 'Severe'];
  
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const accuracy = Math.floor(Math.random() * 20) + 80; // 80-99%
  
  const now = new Date();
  const { date, time } = formatDateTime(now);
  
  return {
    label: condition,
    accuracy,
    severity,
    date,
    time,
    imageUri: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
  };
};
