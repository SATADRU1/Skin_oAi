import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { useScanData } from '@/contexts/ScanContext';
import { generateMockScan } from '@/utils/scanUtils';

// Only show in development
const DEV_MODE = __DEV__;

export const DevHelper: React.FC = () => {
  const { addScan } = useScanData();

  const addTestScan = async () => {
    try {
      const mockScan = generateMockScan();
      await addScan(mockScan);
      Alert.alert('Success', 'Test scan added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add test scan');
    }
  };

  if (!DEV_MODE) {
    return null;
  }

  return (
    <TouchableOpacity 
      onPress={addTestScan}
      style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        opacity: 0.7,
      }}
    >
      <ThemedText style={{ color: 'white', fontSize: 12 }}>+ Test Scan</ThemedText>
    </TouchableOpacity>
  );
};
