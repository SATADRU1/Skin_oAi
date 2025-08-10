import { Dimensions, Platform, PixelRatio, ScaledSize } from 'react-native';

// Base dimensions based on standard 5" screen mobile
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / BASE_WIDTH;

// Function to normalize font size
function normalize(size: number, factor = 1): number {
  const newSize = size * scale * factor;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

// Function to scale a size based on screen width
const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

// Function to scale a size based on screen height
const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

// Function to add a small amount to a size for larger screens
const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

// Function to get responsive padding/margin
const scaleSize = (size: number): number => {
  return Math.round(scale * size);
};

// Function to get responsive font size
const scaleFont = (size: number): number => {
  const scaledSize = scale * size;
  
  // Ensure minimum font size for readability
  if (Platform.OS === 'android') {
    return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Check device type
const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  return (
    (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) ||
    (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920))
  );
};

// Responsive padding/margin
const responsive = {
  // Scale by width (good for horizontal spacing)
  wp: (percentage: number) => {
    const value = (percentage * SCREEN_WIDTH) / 100;
    return Math.round(value);
  },
  // Scale by height (good for vertical spacing)
  hp: (percentage: number) => {
    const value = (percentage * SCREEN_HEIGHT) / 100;
    return Math.round(value);
  },
  // Scale font size
  fs: (size: number, factor = 0.5) => {
    const scaledSize = scale * size;
    return Math.round(scaledSize * factor + size * (1 - factor));
  },
  // Check orientation
  isLandscape: () => {
    const dim = Dimensions.get('window');
    return dim.width >= dim.height;
  },
  // Get screen dimensions
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  // Device type
  isTablet: isTablet(),
  // Platform specific scaling
  platform: {
    ios: Platform.OS === 'ios',
    android: Platform.OS === 'android',
  },
};

export {
  normalize,
  scaleWidth,
  scaleHeight,
  moderateScale,
  scaleSize,
  scaleFont,
  responsive,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
