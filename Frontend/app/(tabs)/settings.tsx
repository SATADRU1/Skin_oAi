import {
  Bell,
  ChevronRight,
  Database,
  CircleHelp as HelpCircle,
  Info,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Sun,
  User,
  LogOut,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';
import { AuthContext } from '@/app/_layout';
import { useContext } from 'react';

const safeArea = getSafeAreaInsets();

export default function SettingsScreen() {
  // Removed local darkMode state, now using global theme
  // const [darkMode, setDarkMode] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const settingSections = [
    {
      title: "Preferences",
      items: [
        {
          // Use global theme for icon and toggle logic
          icon: theme === 'dark' ? Moon : Sun,
          title: "Dark Mode",
          subtitle: "Toggle dark theme",
          type: "switch",
          value: theme === 'dark', // Value reflects global theme
          onToggle: toggleTheme, // Toggles global theme
        },
        {
          icon: Bell,
          title: "Notifications",
          subtitle: "Scan reminders and updates",
          type: "switch",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: Database,
          title: "Data Sharing",
          subtitle: "Help improve AI accuracy",
          type: "switch",
          value: dataSharing,
          onToggle: setDataSharing,
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: Info,
          title: "About Skin AI",
          subtitle: "App version and info",
          type: "navigation",
          onPress: () => showAboutAlert(),
        },
        {
          icon: Shield,
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "navigation",
          onPress: () => showPrivacyAlert(),
        },
        {
          icon: HelpCircle,
          title: "Help & Support",
          subtitle: "FAQs and contact info",
          type: "navigation",
          onPress: () => showHelpAlert(),
        },
        {
          icon: Mail,
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          type: "navigation",
          onPress: () => showContactAlert(),
        },
      ],
    },
  ];

  const showAboutAlert = () => {
    Alert.alert(
      "About Skin AI",
      "Version 1.0.0\n\nSkin AI is an advanced skin analysis application powered by artificial intelligence. Our mission is to make dermatological screening accessible to everyone.\n\n© 2024 Skin AI",
      [{ text: "OK" }]
    );
  };

  const showPrivacyAlert = () => {
    Alert.alert(
      "Privacy Policy",
      "Your privacy is important to us. We use industry-standard encryption to protect your data. Scan images are processed securely and can be deleted at any time. We never share personal information without consent.",
      [{ text: "OK" }]
    );
  };

  const showHelpAlert = () => {
    Alert.alert(
      "Help & Support",
      "Frequently Asked Questions:\n\n• How accurate is the AI? Our AI has 94% accuracy in clinical tests.\n\n• Is my data secure? Yes, all data is encrypted and stored securely.\n\n• Can I delete my scans? Yes, you can delete scans anytime in the History tab.",
      [{ text: "OK" }]
    );
  };

  const showContactAlert = () => {
    Alert.alert(
      "Contact Us",
      "Need help? We're here for you!\n\nEmail: support@skinai.app\nPhone: +1 (555) 123-4567\n\nBusiness Hours:\nMon-Fri: 9AM - 6PM EST\nWeekends: 10AM - 4PM EST",
      [{ text: "OK" }]
    );
  };

  return (
    // Use ThemedView for the main container to apply theme background
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <ThemedView style={styles.versionBadge}>
          <Smartphone size={16} color="#3b82f6" />
          <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          // Use ThemedView for sections to apply theme background
          <ThemedView key={sectionIndex} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>

            {section.items.map((item, itemIndex) => {
              // Conditionally render TouchableOpacity for navigation items,
              // and ThemedView for switch items to allow interaction with the Switch.
              const ItemWrapper = item.type === "switch" ? ThemedView : TouchableOpacity;

              return (
                <ItemWrapper
                  key={itemIndex}
                  style={styles.settingItem}
                  // Only apply onPress for navigation type items
                  onPress={item.type === "navigation" ? item.onPress : undefined}
                  // The 'disabled' prop is no longer needed on ItemWrapper
                >
                  <ThemedView style={styles.settingIcon}>
                    <item.icon size={20} color="#3b82f6" strokeWidth={2} />
                  </ThemedView>

                  <ThemedView style={styles.settingContent}>
                    <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.settingSubtitle}>{item.subtitle}</ThemedText>
                  </ThemedView>

                  {item.type === "switch" ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: theme === 'light' ? "#f3f4f6" : "#4b5563", true: "#3b82f6" }}
                      thumbColor={item.value ? "#ffffff" : (theme === 'light' ? "#9ca3af" : "#d1d5db")}
                    />
                  ) : (
                    <ChevronRight size={20} color="#9ca3af" />
                  )}
                </ItemWrapper>
              );
            })}
          </ThemedView>
        ))}

        {/* App Info */}
        <ThemedView style={styles.appInfo}>
          <ThemedText style={styles.appInfoTitle}>Skin AI</ThemedText>
          <ThemedText style={styles.appInfoSubtitle}>
            Advanced skin analysis powered by artificial intelligence
          </ThemedText>
          <ThemedText style={styles.disclaimer}>
            This app is not a substitute for professional medical advice. Always
            consult with a healthcare provider for medical concerns.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsive.wp(5),
    paddingVertical: responsive.hp(2.5),
  },
  title: {
    fontSize: scaleFont(28),
    fontFamily: "Inter-Bold",
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: responsive.wp(3),
    paddingVertical: responsive.hp(0.8),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  versionText: {
    fontSize: scaleFont(12),
    fontFamily: "Inter-Medium",
    color: "#0369a1",
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: responsive.wp(5),
  },
  section: {
    marginBottom: responsive.hp(4),
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontFamily: "Inter-SemiBold",
    marginBottom: responsive.hp(1.5),
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: responsive.wp(4),
    paddingTop: responsive.hp(2),
  },
  settingItem: {
    borderRadius: 12,
    padding: responsive.wp(4),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: responsive.wp(4),
    marginBottom: responsive.hp(1),
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingIcon: {
    width: responsive.wp(10),
    height: responsive.wp(10),
    backgroundColor: "#f0f9ff",
    borderRadius: responsive.wp(5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsive.wp(4),
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: scaleFont(16),
    fontFamily: "Inter-SemiBold",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: scaleFont(14),
    fontFamily: "Inter-Regular",
  },
  appInfo: {
    borderRadius: 12,
    padding: responsive.wp(5),
    marginBottom: responsive.hp(2.5),
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  appInfoTitle: {
    fontSize: scaleFont(20),
    fontFamily: "Inter-Bold",
    marginBottom: responsive.hp(1),
  },
  appInfoSubtitle: {
    fontSize: scaleFont(14),
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: responsive.hp(2),
    lineHeight: scaleFont(20),
  },
  disclaimer: {
    fontSize: scaleFont(12),
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: scaleFont(16),
    fontStyle: "italic",
  },
});
