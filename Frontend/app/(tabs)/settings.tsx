import {
  Bell,
  ChevronRight,
  Database,
  CircleHelp as HelpCircle,
  Info,
  Mail,
  Shield,
  Smartphone,
  User,
  LogOut,
  Settings,
  Palette,
  Lock,
  Heart,
  Star,
  MessageCircle,
} from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ANIMATIONS } from '@/constants/DesignSystem';
import { AuthContext } from '@/app/_layout';
import { useContext } from 'react';

const safeArea = getSafeAreaInsets();

export default function SettingsScreen() {
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATIONS.normal,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const settingSections = [
    {
      title: "Preferences",
      gradient: COLORS.gradients.primary,
      items: [
        {
          icon: Bell,
          title: "Notifications",
          subtitle: "Scan reminders and updates",
          type: "switch" as const,
          value: notifications,
          onToggle: setNotifications,
          color: COLORS.accent.amber,
        },
        {
          icon: Database,
          title: "Data Sharing",
          subtitle: "Help improve AI accuracy",
          type: "switch" as const,
          value: dataSharing,
          onToggle: setDataSharing,
          color: COLORS.secondary[500],
        },
      ],
    },
    {
      title: "Support & Info",
      gradient: COLORS.gradients.secondary,
      items: [
        {
          icon: Info,
          title: "About Skin AI",
          subtitle: "App version and info",
          type: "navigation" as const,
          onPress: () => showAboutAlert(),
          color: COLORS.primary[500],
        },
        {
          icon: Shield,
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "navigation" as const,
          onPress: () => showPrivacyAlert(),
          color: COLORS.accent.emerald,
        },
        {
          icon: HelpCircle,
          title: "Help & Support",
          subtitle: "FAQs and contact info",
          type: "navigation" as const,
          onPress: () => showHelpAlert(),
          color: COLORS.accent.cyan,
        },
        {
          icon: MessageCircle,
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          type: "navigation" as const,
          onPress: () => showContactAlert(),
          color: COLORS.accent.pink,
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
    <ThemedView style={styles.container}>
      {/* Modern Header */}
      <Animated.View style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <ThemedView>
          <ThemedText style={styles.title}>Settings ⚙️</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your experience</ThemedText>
        </ThemedView>
        <LinearGradient
          colors={[COLORS.primary[100], COLORS.primary[200]]}
          style={styles.versionBadge}
        >
          <Star size={responsive.wp(4)} color={COLORS.primary[600]} />
          <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <Animated.View
            key={sectionIndex}
            style={[
              {
                opacity: scaleAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <ThemedView style={styles.section}>
              <ThemedView style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
              </ThemedView>

              {section.items.map((item, itemIndex) => {
                if (item.type === "switch") {
                  return (
                    <ThemedView key={itemIndex} style={styles.settingItem}>
                      <LinearGradient
                        colors={[item.color + '20', item.color + '30']}
                        style={styles.settingIcon}
                      >
                        <item.icon size={responsive.wp(5)} color={item.color} strokeWidth={2.5} />
                      </LinearGradient>

                      <ThemedView style={styles.settingContent}>
                        <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.settingSubtitle}>{item.subtitle}</ThemedText>
                      </ThemedView>

                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ 
                          false: COLORS.neutral[200], 
                          true: item.color 
                        }}
                        thumbColor={item.value ? COLORS.neutral[0] : COLORS.neutral[400]}
                        ios_backgroundColor={COLORS.neutral[200]}
                      />
                    </ThemedView>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      style={styles.settingItem}
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={[item.color + '20', item.color + '30']}
                        style={styles.settingIcon}
                      >
                        <item.icon size={responsive.wp(5)} color={item.color} strokeWidth={2.5} />
                      </LinearGradient>

                      <ThemedView style={styles.settingContent}>
                        <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.settingSubtitle}>{item.subtitle}</ThemedText>
                      </ThemedView>

                      <ThemedView style={styles.chevronContainer}>
                        <ChevronRight size={responsive.wp(5)} color={COLORS.neutral[400]} />
                      </ThemedView>
                    </TouchableOpacity>
                  );
                }
              })}
            </ThemedView>
          </Animated.View>
        ))}

        {/* Enhanced App Info */}
        <Animated.View style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <LinearGradient
            colors={COLORS.gradients.accent}
            style={styles.appInfo}
          >
            <ThemedView style={styles.appInfoContent}>
              <ThemedView style={styles.appIconContainer}>
                <Heart size={responsive.wp(8)} color={COLORS.neutral[0]} strokeWidth={2} />
              </ThemedView>
              <ThemedText style={styles.appInfoTitle}>SkinOAI</ThemedText>
              <ThemedText style={styles.appInfoSubtitle}>
                Advanced AI-powered skin analysis for everyone
              </ThemedText>
              <ThemedText style={styles.disclaimer}>
                ⚠️ This app is not a substitute for professional medical advice. Always consult with a healthcare provider for medical concerns.
              </ThemedText>
            </ThemedView>
          </LinearGradient>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View style={[
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Logout", style: "destructive", onPress: logout }
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.error + '20', COLORS.error + '30']}
              style={styles.logoutGradient}
            >
              <LogOut size={responsive.wp(5)} color={COLORS.error} strokeWidth={2.5} />
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
    lineHeight: TYPOGRAPHY.sizes['3xl'] * 1.2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs,
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xl,
    ...SHADOWS.sm,
  },
  versionText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.primary[700],
    marginLeft: SPACING.xs,
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS['2xl'],
    marginBottom: SPACING['3xl'],
    ...SHADOWS.lg,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    textTransform: 'none',
    letterSpacing: 0,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  settingIcon: {
    width: responsive.wp(12),
    height: responsive.wp(12),
    borderRadius: RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.lg,
    ...SHADOWS.sm,
  },
  settingContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[800],
    lineHeight: TYPOGRAPHY.sizes.lg * 1.2,
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs / 2,
    lineHeight: TYPOGRAPHY.sizes.sm * 1.3,
  },
  chevronContainer: {
    backgroundColor: 'transparent',
    padding: SPACING.xs,
  },
  appInfo: {
    borderRadius: RADIUS['2xl'],
    padding: SPACING['2xl'],
    marginBottom: SPACING.lg,
    alignItems: "center",
    ...SHADOWS.xl,
  },
  appInfoContent: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  appIconContainer: {
    backgroundColor: COLORS.surface.glass,
    padding: SPACING.lg,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  appInfoTitle: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[0],
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.sizes['2xl'] * 1.2,
  },
  appInfoSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.surface.primary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: TYPOGRAPHY.sizes.base * 1.4,
    opacity: 0.9,
  },
  disclaimer: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.surface.primary,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.sizes.sm * 1.4,
    opacity: 0.8,
    fontStyle: 'normal',
  },
  logoutButton: {
    marginBottom: SPACING['4xl'],
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS['2xl'],
  },
  logoutText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.error,
    marginLeft: SPACING.md,
  },
});
