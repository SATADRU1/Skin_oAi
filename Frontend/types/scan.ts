export interface ScanResult {
  id: string;
  label: string;
  accuracy: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  date: string;
  time: string;
  imageUri: string;
  createdAt: number; // timestamp for sorting
}

export interface DiseaseStats {
  name: string;
  count: number;
  totalAccuracy: number;
  averageAccuracy: number;
  severityBreakdown: {
    None: number;
    Mild: number;
    Moderate: number;
    Severe: number;
  };
  lastDetected: string;
}

export interface ScanStats {
  totalScans: number;
  averageAccuracy: number;
  healthScore: string;
  healthyCount: number;
  // Enhanced stats for disease tracking
  diseaseStats: DiseaseStats[];
  severityDistribution: {
    None: number;
    Mild: number;
    Moderate: number;
    Severe: number;
  };
  mostCommonCondition: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  improvementTrend: 'Improving' | 'Stable' | 'Declining';
}

export interface ScanContextType {
  scans: ScanResult[];
  stats: ScanStats;
  addScan: (result: Omit<ScanResult, 'id' | 'createdAt'>) => Promise<void>;
  deleteScan: (id: string) => Promise<void>;
  isLoading: boolean;
}
