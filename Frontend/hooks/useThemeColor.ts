import { Colors } from '@/contexts/Colors'; // Assuming Colors is in contexts, if not, adjust path
import { useTheme } from './useTheme'; // Import the new useTheme hook

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const { theme } = useTheme(); // Get the current theme from our context
  const tintColor = props[theme];

  if (tintColor) {
    return tintColor;
  }

  return Colors[theme][colorName];
}