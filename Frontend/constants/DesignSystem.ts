import { Platform } from 'react-native';

// Modern Color Palette
export const COLORS = {
  // Primary Brand Colors
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF', 
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main brand color
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // Secondary Colors
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Accent Colors
  accent: {
    cyan: '#06B6D4',
    purple: '#8B5CF6', 
    pink: '#EC4899',
    orange: '#F97316',
    amber: '#F59E0B',
    emerald: '#10B981',
  },

  // Neutral Colors
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic Colors
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',

  // Background Gradients
  gradients: {
    primary: ['#6366F1', '#4F46E5', '#4338CA'] as const,
    secondary: ['#22C55E', '#16A34A', '#15803D'] as const, 
    accent: ['#06B6D4', '#0891B2', '#0E7490'] as const,
    warm: ['#F97316', '#EA580C', '#DC2626'] as const,
    cool: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const,
    dark: ['#374151', '#1F2937', '#111827'] as const,
  },

  // Card & Surface Colors
  surface: {
    primary: 'rgba(255, 255, 255, 0.95)',
    secondary: 'rgba(248, 250, 252, 0.9)',
    glass: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.3)',
  }
};

// Typography Scale
export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  families: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold', 
    bold: 'Inter-Bold',
  }
};

// Spacing Scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
};

// Border Radius
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadow Presets
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  colored: {
    primary: {
      shadowColor: COLORS.primary[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    }
  }
};

// Animation Durations
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Component Specific Styles
export const COMPONENTS = {
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    borderRadius: RADIUS.lg,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  input: {
    height: 52,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  }
};

export default {
  COLORS,
  TYPOGRAPHY, 
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATIONS,
  COMPONENTS,
};
