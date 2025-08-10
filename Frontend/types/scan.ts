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

export interface ScanStats {
  totalScans: number;
  averageAccuracy: number;
  healthScore: string;
  healthyCount: number;
}

export interface ScanContextType {
  scans: ScanResult[];
  stats: ScanStats;
  addScan: (result: Omit<ScanResult, 'id' | 'createdAt'>) => Promise<void>;
  deleteScan: (id: string) => Promise<void>;
  isLoading: boolean;
}
