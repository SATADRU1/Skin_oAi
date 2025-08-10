import React from 'react';
import { ThemedText } from './ThemedText';

// Only show in development
const DEV_MODE = __DEV__;

export const DevHelper: React.FC = () => {
  if (!DEV_MODE) {
    return null;
  }

  return null;
};
