import { Tabs } from "expo-router";
import { FileText, Chrome as Home, Settings } from "lucide-react-native";
import { responsive, getBottomSpace } from '@/utils/responsive';

const bottomSpace = getBottomSpace();

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
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
