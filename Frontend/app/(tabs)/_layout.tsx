import { Tabs } from "expo-router";
import { FileText, Home, Settings } from "lucide-react-native";
import { responsive, getBottomSpace } from '@/utils/responsive';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/contexts/Colors';

const bottomSpace = getBottomSpace();

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: theme === 'dark' ? '#2D2D2D' : '#f3f4f6',
          paddingTop: responsive.hp(1),
          paddingBottom: responsive.hp(1) + bottomSpace,
          height: responsive.hp(8) + bottomSpace,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter-Medium",
          fontSize: responsive.fs(12),
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
