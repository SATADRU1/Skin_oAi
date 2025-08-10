import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ScanResult, ScanStats, ScanContextType } from '@/types/scan';
import {
  generateId,
  formatDateTime,
  calculateStats,
  saveScansToStorage,
  loadScansFromStorage,
} from '@/utils/scanUtils';

const ScanContext = createContext<ScanContextType | undefined>(undefined);

interface ScanProviderProps {
  children: ReactNode;
}

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<ScanStats>({
    totalScans: 0,
    averageAccuracy: 0,
    healthScore: 'A+',
    healthyCount: 0,
    diseaseStats: [],
    severityDistribution: { None: 0, Mild: 0, Moderate: 0, Severe: 0 },
    mostCommonCondition: 'None',
    riskLevel: 'Low',
    improvementTrend: 'Stable',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load scans from storage on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const storedScans = await loadScansFromStorage();
        setScans(storedScans);
        setStats(calculateStats(storedScans));
      } catch (error) {
        console.error('Error loading initial scan data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Update stats whenever scans change
  useEffect(() => {
    if (!isLoading) {
      setStats(calculateStats(scans));
    }
  }, [scans, isLoading]);

  // Add a new scan
  const addScan = async (result: Omit<ScanResult, 'id' | 'createdAt'>): Promise<void> => {
    try {
      const now = new Date();
      const newScan: ScanResult = {
        ...result,
        id: generateId(),
        createdAt: now.getTime(),
      };

      const updatedScans = [...scans, newScan];
      setScans(updatedScans);
      await saveScansToStorage(updatedScans);
      
      console.log('Scan added successfully:', newScan.id);
    } catch (error) {
      console.error('Error adding scan:', error);
      throw error;
    }
  };

  // Delete a scan
  const deleteScan = async (id: string): Promise<void> => {
    try {
      const updatedScans = scans.filter(scan => scan.id !== id);
      setScans(updatedScans);
      await saveScansToStorage(updatedScans);
      
      console.log('Scan deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting scan:', error);
      throw error;
    }
  };

  // Clear all scans
  const clearAllScans = async (): Promise<void> => {
    try {
      setScans([]);
      await saveScansToStorage([]);
      
      console.log('All scans cleared successfully');
    } catch (error) {
      console.error('Error clearing all scans:', error);
      throw error;
    }
  };

  const value: ScanContextType = {
    scans,
    stats,
    addScan,
    deleteScan,
    clearAllScans,
    isLoading,
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook to use scan context
export const useScanData = (): ScanContextType => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScanData must be used within a ScanProvider');
  }
  return context;
};
