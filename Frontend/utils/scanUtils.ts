import { ScanResult, ScanStats, DiseaseStats } from '@/types/scan';
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

// Calculate disease-specific statistics
const calculateDiseaseStats = (scans: ScanResult[]): DiseaseStats[] => {
  const diseaseMap = new Map<string, ScanResult[]>();
  
  // Group scans by disease label
  scans.forEach(scan => {
    if (!diseaseMap.has(scan.label)) {
      diseaseMap.set(scan.label, []);
    }
    diseaseMap.get(scan.label)!.push(scan);
  });
  
  // Calculate stats for each disease
  return Array.from(diseaseMap.entries()).map(([name, diseaseScans]) => {
    const count = diseaseScans.length;
    const totalAccuracy = diseaseScans.reduce((sum, scan) => sum + scan.accuracy, 0);
    const averageAccuracy = Math.round(totalAccuracy / count);
    
    // Calculate severity breakdown
    const severityBreakdown = {
      None: diseaseScans.filter(scan => scan.severity === 'None').length,
      Mild: diseaseScans.filter(scan => scan.severity === 'Mild').length,
      Moderate: diseaseScans.filter(scan => scan.severity === 'Moderate').length,
      Severe: diseaseScans.filter(scan => scan.severity === 'Severe').length,
    };
    
    // Get last detected date
    const lastDetected = diseaseScans
      .sort((a, b) => b.createdAt - a.createdAt)[0].date;
    
    return {
      name,
      count,
      totalAccuracy,
      averageAccuracy,
      severityBreakdown,
      lastDetected,
    };
  }).sort((a, b) => b.count - a.count); // Sort by frequency
};

// Calculate severity distribution
const calculateSeverityDistribution = (scans: ScanResult[]) => {
  return {
    None: scans.filter(scan => scan.severity === 'None').length,
    Mild: scans.filter(scan => scan.severity === 'Mild').length,
    Moderate: scans.filter(scan => scan.severity === 'Moderate').length,
    Severe: scans.filter(scan => scan.severity === 'Severe').length,
  };
};

// Calculate risk level based on severity distribution
const calculateRiskLevel = (severityDistribution: any): 'Low' | 'Medium' | 'High' => {
  const { None, Mild, Moderate, Severe } = severityDistribution;
  const total = None + Mild + Moderate + Severe;
  
  if (total === 0) return 'Low';
  
  const severePercentage = (Severe / total) * 100;
  const moderatePercentage = (Moderate / total) * 100;
  
  if (severePercentage > 20 || moderatePercentage > 40) return 'High';
  if (severePercentage > 10 || moderatePercentage > 20) return 'Medium';
  return 'Low';
};

// Calculate improvement trend based on recent scans
const calculateImprovementTrend = (scans: ScanResult[]): 'Improving' | 'Stable' | 'Declining' => {
  if (scans.length < 3) return 'Stable';
  
  // Get last 3 scans
  const recentScans = scans
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);
  
  // Calculate severity scores (None=0, Mild=1, Moderate=2, Severe=3)
  const severityScores = recentScans.map(scan => {
    switch (scan.severity) {
      case 'None': return 0;
      case 'Mild': return 1;
      case 'Moderate': return 2;
      case 'Severe': return 3;
      default: return 0;
    }
  });
  
  // Check if trend is improving (decreasing scores)
  if (severityScores[0] < severityScores[severityScores.length - 1]) return 'Improving';
  if (severityScores[0] > severityScores[severityScores.length - 1]) return 'Declining';
  return 'Stable';
};

// Calculate statistics from scan results
export const calculateStats = (scans: ScanResult[]): ScanStats => {
  if (scans.length === 0) {
    return {
      totalScans: 0,
      averageAccuracy: 0,
      healthScore: 'A+',
      healthyCount: 0,
      diseaseStats: [],
      severityDistribution: { None: 0, Mild: 0, Moderate: 0, Severe: 0 },
      mostCommonCondition: 'None',
      riskLevel: 'Low',
      improvementTrend: 'Stable',
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

  // Calculate enhanced stats
  const diseaseStats = calculateDiseaseStats(scans);
  const severityDistribution = calculateSeverityDistribution(scans);
  const mostCommonCondition = diseaseStats.length > 0 ? diseaseStats[0].name : 'None';
  const riskLevel = calculateRiskLevel(severityDistribution);
  const improvementTrend = calculateImprovementTrend(scans);

  return {
    totalScans,
    averageAccuracy,
    healthScore,
    healthyCount,
    diseaseStats,
    severityDistribution,
    mostCommonCondition,
    riskLevel,
    improvementTrend,
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

// Generate mock scan data for testing
export const generateMockScan = (): ScanResult => {
  const now = new Date();
  const { date, time } = formatDateTime(now);
  
  // Mock disease conditions with realistic data
  const mockConditions = [
    { label: 'Melanoma', severity: 'Severe' as const },
    { label: 'Basal Cell Carcinoma', severity: 'Moderate' as const },
    { label: 'Actinic Keratosis', severity: 'Mild' as const },
    { label: 'Dermatitis', severity: 'Mild' as const },
    { label: 'Psoriasis', severity: 'Moderate' as const },
    { label: 'Healthy Skin', severity: 'None' as const },
  ];
  
  const randomCondition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
  
  return {
    id: generateId(),
    label: randomCondition.label,
    accuracy: Math.floor(Math.random() * 20) + 80, // 80-99% accuracy
    severity: randomCondition.severity,
    date,
    time,
    imageUri: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Mock+Scan',
    createdAt: now.getTime(),
  };
};
