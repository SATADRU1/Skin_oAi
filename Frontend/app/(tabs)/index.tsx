import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Award,
  Camera,
  Clock,
  Scan,
  Shield,
  TrendingUp,
  Sparkles,
  Activity,
  ChevronRight,
} from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ANIMATIONS } from '@/constants/DesignSystem';
import { useEffect, useRef } from 'react';

const safeArea = getSafeAreaInsets();

export default function HomeScreen() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.slow,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATIONS.slow,
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
    
    // Pulse animation for scan button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      ])
    );
    
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, []);

  const recentScans = [
    {
      id: "1",
      date: "2024-01-15",
      time: "10:30 AM",
      condition: "Melanoma",
      confidence: 95,
      severity: "Mild",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Melanoma.jpg/250px-Melanoma.jpg",
    },
    {
      id: "2",
      date: "2024-01-10",
      time: "9:45 AM",
      condition: "Dry Skin",
      confidence: 92,
      severity: "Mild",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzP5xKoDr8QlvRur1LyqadPnQbLi_Ito1MXQ&s",
    },
    {
      id: "3",
      date: "2024-01-08",
      time: "4:20 PM",
      condition: "Normal Skin",
      confidence: 96,
      severity: "None",
      image:
        "https://prequelskin.com/cdn/shop/articles/PRQL_Blog_Hero_NormalSkin.jpg?v=1690383094",
    },
    {
      id: "4",
      date: "2024-01-05",
      time: "11:10 AM",
      condition: "Skin Rashes",
      confidence: 89,
      severity: "Mild",
      image:
        "https://images.prismic.io/gohealth/MTA3MDQ0OWEtNDY4My00MjBiLTljY2QtZjQ5YzdhODdkOWQ4_whats-that-rash-poison-ivy.png?auto=compress,format&rect=0,0,974,547&w=974&h=547",
    },
  ];

  const stats = [
    { icon: Scan, label: "Total Scans", value: "4", color: COLORS.primary[500], gradient: COLORS.gradients.primary },
    { icon: TrendingUp, label: "Accuracy", value: "94%", color: COLORS.secondary[500], gradient: COLORS.gradients.secondary },
    { icon: Activity, label: "Health Score", value: "A+", color: COLORS.accent.purple, gradient: COLORS.gradients.cool },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ThemedView>
            <ThemedText style={styles.greeting}>Hello there! 👋</ThemedText>
            <ThemedText style={styles.subtitle}>Let's check your skin health today</ThemedText>
          </ThemedView>
          <LinearGradient
            colors={[COLORS.primary[100], COLORS.primary[200]]}
            style={styles.profileIcon}
          >
            <Sparkles size={scaleFont(24)} color={COLORS.primary[600]} />
          </LinearGradient>
        </Animated.View>

        {/* Main Scan Button */}
        <Animated.View style={[{
          transform: [{ scale: pulseAnim }]
        }]}>
          <TouchableOpacity
            style={styles.scanButtonContainer}
            onPress={() => router.push("/scan")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={COLORS.gradients.primary}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.scanButton}
            >
              <ThemedView style={styles.scanIconContainer}>
                <Camera size={responsive.wp(8)} color={COLORS.neutral[0]} strokeWidth={2.5} />
              </ThemedView>
              <ThemedView style={styles.scanContent} lightColor="transparent" darkColor="transparent">
                <ThemedText style={styles.scanButtonText}>AI Skin Analysis</ThemedText>
                <ThemedText style={styles.scanButtonSubtitle}>
                  Get instant results with advanced AI
                </ThemedText>
              </ThemedView>
              <ChevronRight size={responsive.wp(6)} color={COLORS.surface.glass} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View style={[
          styles.statsContainer,
          {
            opacity: scaleAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.7}>
              <LinearGradient
                colors={[`${stat.color}15`, `${stat.color}25`]}
                style={styles.statIconWrapper}
              >
                <stat.icon size={responsive.wp(6)} color={stat.color} strokeWidth={2} />
              </LinearGradient>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Recent Scans Section */}
        <Animated.View style={[
          styles.recentScansHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ThemedView>
            <ThemedText style={styles.sectionTitle}>Recent Analysis</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>Your skin health journey</ThemedText>
          </ThemedView>
          <TouchableOpacity 
            onPress={() => router.push("/history")}
            style={styles.viewAllButton}
          >
            <ThemedText style={styles.viewAllText}>View All</ThemedText>
            <ChevronRight size={responsive.wp(4)} color={COLORS.primary[500]} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentScansList}
        >
          {recentScans.map((scan, index) => (
            <Animated.View
              key={scan.id}
              style={[
                { opacity: scaleAnim },
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <TouchableOpacity
                style={styles.scanCard}
                onPress={() => router.push({ pathname: "/result", params: { image: scan.image, text: scan.condition } })}
                activeOpacity={0.9}
              >
                <ThemedView style={styles.scanImageContainer}>
                  <Image source={{ uri: scan.image }} style={styles.scanImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.scanImageOverlay}
                  />
                  <ThemedView style={styles.confidenceBadge}>
                    <ThemedText style={styles.confidenceText}>{scan.confidence}%</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.scanCardContent}>
                  <ThemedText style={styles.scanCondition}>{scan.condition}</ThemedText>
                  <ThemedView style={styles.scanDetails}>
                    <Clock size={responsive.wp(3)} color={COLORS.neutral[400]} />
                    <ThemedText style={styles.scanDate}>{scan.date}</ThemedText>
                  </ThemedView>
                  <ThemedView style={[styles.severityBadge, {
                    backgroundColor: scan.severity === 'None' ? COLORS.secondary[100] : COLORS.accent.orange + '20'
                  }]}>
                    <ThemedText style={[styles.severityText, {
                      color: scan.severity === 'None' ? COLORS.secondary[600] : COLORS.accent.orange
                    }]}>{scan.severity}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
    lineHeight: TYPOGRAPHY.sizes['3xl'] * 1.2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs,
    lineHeight: TYPOGRAPHY.sizes.lg * 1.4,
  },
  profileIcon: {
    width: responsive.wp(14),
    height: responsive.wp(14),
    borderRadius: RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
  },
  scanButtonContainer: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS['2xl'],
    overflow: "hidden",
    marginBottom: SPACING['3xl'],
    ...SHADOWS.xl,
    shadowColor: COLORS.primary[500],
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    minHeight: responsive.hp(8),
  },
  scanIconContainer: {
    width: responsive.wp(16),
    height: responsive.wp(16),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface.glass,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.lg,
  },
  scanContent: {
    flex: 1,
  },
  scanButtonText: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[0],
    lineHeight: TYPOGRAPHY.sizes['2xl'] * 1.2,
  },
  scanButtonSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.surface.primary,
    marginTop: SPACING.xs,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING['3xl'],
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS['2xl'],
    paddingVertical: SPACING.xl,
    ...SHADOWS.lg,
  },
  statCard: {
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
  },
  statIconWrapper: {
    width: responsive.wp(14),
    height: responsive.wp(14),
    borderRadius: RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    lineHeight: TYPOGRAPHY.sizes['2xl'] * 1.1,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  recentScansHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    lineHeight: TYPOGRAPHY.sizes['2xl'] * 1.2,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[500],
    marginTop: SPACING.xs / 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary[50],
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.primary[600],
    marginRight: SPACING.xs,
  },
  recentScansList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['2xl'],
  },
  scanCard: {
    width: responsive.wp(45),
    marginRight: SPACING.lg,
    borderRadius: RADIUS['2xl'],
    backgroundColor: COLORS.surface.primary,
    overflow: "hidden",
    ...SHADOWS.lg,
  },
  scanImageContainer: {
    position: 'relative',
  },
  scanImage: {
    width: "100%",
    height: responsive.hp(18),
    resizeMode: "cover",
  },
  scanImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  confidenceBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    ...SHADOWS.sm,
  },
  confidenceText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.secondary[600],
  },
  scanCardContent: {
    padding: SPACING.lg,
  },
  scanCondition: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.sizes.lg * 1.2,
  },
  scanDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  scanDate: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[500],
    marginLeft: SPACING.xs,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  severityText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
