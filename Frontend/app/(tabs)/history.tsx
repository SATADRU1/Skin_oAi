import { Calendar, Filter, TrendingUp, Activity, BarChart3, TrendingDown, Search, ArrowUpRight, Clock, Shield, ChevronDown } from "lucide-react-native";
import { Image, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from '@/hooks/useTheme';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ANIMATIONS } from '@/constants/DesignSystem';
import { useEffect, useRef, useState } from 'react';

const safeArea = getSafeAreaInsets();

export default function HistoryScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedFilter, setSelectedFilter] = useState('All');
  
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

  const scans = [
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "None":
        return COLORS.secondary[500];
      case "Mild":
        return COLORS.accent.amber;
      case "Moderate":
        return COLORS.accent.orange;
      case "Severe":
        return COLORS.error;
      default:
        return COLORS.neutral[500];
    }
  };

  const getSeverityGradient = (severity: string) => {
    switch (severity) {
      case "None":
        return COLORS.gradients.secondary;
      case "Mild":
        return COLORS.gradients.warm;
      case "Moderate":
        return COLORS.gradients.warm;
      case "Severe":
        return [COLORS.error, '#DC2626'];
      default:
        return COLORS.gradients.dark;
    }
  };

  const filterOptions = ['All', 'Healthy', 'Mild', 'Moderate', 'Severe'];
  const healthyCount = scans.filter((s) => s.severity === "None").length;
  const avgConfidence = Math.round(scans.reduce((sum, scan) => sum + scan.confidence, 0) / scans.length);

  const renderScanCard = ({ item: scan, index }: { item: any, index: number }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 30],
                outputRange: [0, 30 * (index + 1) / 4],
              })
            }
          ]
        }
      ]}
    >
      <TouchableOpacity style={styles.scanCard} activeOpacity={0.9}>
        <ThemedView style={styles.scanImageContainer}>
          <Image source={{ uri: scan.image }} style={styles.scanImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.scanImageOverlay}
          />
          <ThemedView style={styles.confidenceBadge}>
            <Shield size={responsive.wp(3)} color={COLORS.primary[600]} />
            <ThemedText style={styles.confidenceText}>{scan.confidence}%</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.scanContent}>
          <ThemedView style={styles.scanHeader}>
            <ThemedText style={styles.scanCondition}>{scan.condition}</ThemedText>
            <ThemedView style={[styles.severityBadge, {
              backgroundColor: getSeverityColor(scan.severity) + '20'
            }]}>
              <ThemedView style={[styles.severityDot, {
                backgroundColor: getSeverityColor(scan.severity)
              }]} />
              <ThemedText style={[styles.severityText, {
                color: getSeverityColor(scan.severity)
              }]}>{scan.severity}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.scanMeta}>
            <ThemedView style={styles.metaItem}>
              <Clock size={responsive.wp(3.5)} color={COLORS.neutral[400]} />
              <ThemedText style={styles.metaText}>{scan.date}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.timeText}>{scan.time}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ArrowUpRight size={responsive.wp(5)} color={COLORS.neutral[400]} />
      </TouchableOpacity>
    </Animated.View>
  );

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
          <ThemedText style={styles.title}>Scan History 📋</ThemedText>
          <ThemedText style={styles.subtitle}>Track your skin health journey</ThemedText>
        </ThemedView>
        <ThemedView style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <LinearGradient
              colors={[COLORS.primary[100], COLORS.primary[200]]}
              style={styles.actionButtonGradient}
            >
              <Search size={responsive.wp(5)} color={COLORS.primary[600]} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <LinearGradient
              colors={[COLORS.secondary[100], COLORS.secondary[200]]}
              style={styles.actionButtonGradient}
            >
              <Filter size={responsive.wp(5)} color={COLORS.secondary[600]} />
            </LinearGradient>
          </TouchableOpacity>
        </ThemedView>
      </Animated.View>

      {/* Enhanced Summary Stats */}
      <Animated.View style={[
        styles.summaryContainer,
        {
          opacity: scaleAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <LinearGradient
          colors={COLORS.gradients.primary}
          style={styles.summaryCard}
        >
          <TrendingUp size={responsive.wp(7)} color={COLORS.neutral[0]} strokeWidth={2.5} />
          <ThemedView style={styles.summaryInfo}>
            <ThemedText style={styles.summaryValue}>{scans.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Scans</ThemedText>
          </ThemedView>
        </LinearGradient>
        
        <LinearGradient
          colors={COLORS.gradients.secondary}
          style={styles.summaryCard}
        >
          <Activity size={responsive.wp(7)} color={COLORS.neutral[0]} strokeWidth={2.5} />
          <ThemedView style={styles.summaryInfo}>
            <ThemedText style={styles.summaryValue}>{healthyCount}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Healthy</ThemedText>
          </ThemedView>
        </LinearGradient>
        
        <LinearGradient
          colors={COLORS.gradients.accent}
          style={styles.summaryCard}
        >
          <BarChart3 size={responsive.wp(7)} color={COLORS.neutral[0]} strokeWidth={2.5} />
          <ThemedView style={styles.summaryInfo}>
            <ThemedText style={styles.summaryValue}>{avgConfidence}%</ThemedText>
            <ThemedText style={styles.summaryLabel}>Accuracy</ThemedText>
          </ThemedView>
        </LinearGradient>
      </Animated.View>

      {/* Filter Pills */}
      <Animated.View style={[
        styles.filterContainer,
        { opacity: fadeAnim }
      ]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <ThemedView style={[
                styles.filterPill,
                selectedFilter === filter && styles.filterPillActive
              ]}>
                <ThemedText style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive
                ]}>{filter}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Enhanced Scan List */}
      <FlatList
        data={scans}
        renderItem={renderScanCard}
        keyExtractor={(item) => item.id}
        style={styles.scanList}
        contentContainerStyle={styles.scanListContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerActions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  actionButton: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  actionButtonGradient: {
    width: responsive.wp(12),
    height: responsive.wp(12),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.xl,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['3xl'],
    gap: SPACING.md,
  },
  summaryCard: {
    borderRadius: RADIUS['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    ...SHADOWS.lg,
  },
  summaryInfo: {
    marginLeft: SPACING.md,
    backgroundColor: 'transparent',
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[0],
    lineHeight: TYPOGRAPHY.sizes.xl * 1.1,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.surface.primary,
    marginTop: SPACING.xs / 2,
    opacity: 0.9,
  },
  filterContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  filterPillActive: {
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },
  filterText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[700],
  },
  filterTextActive: {
    color: COLORS.neutral[0],
    fontFamily: TYPOGRAPHY.families.semibold,
  },
  scanList: {
    flex: 1,
  },
  scanListContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  scanCard: {
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS['2xl'],
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  scanImageContainer: {
    position: 'relative',
    marginRight: SPACING.lg,
  },
  scanImage: {
    width: responsive.wp(18),
    height: responsive.wp(18),
    borderRadius: RADIUS.xl,
  },
  scanImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  confidenceBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  confidenceText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.primary[600],
    marginLeft: SPACING.xs / 2,
  },
  scanContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
    backgroundColor: 'transparent',
  },
  scanCondition: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    flex: 1,
    marginRight: SPACING.sm,
    lineHeight: TYPOGRAPHY.sizes.lg * 1.2,
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.md,
  },
  severityDot: {
    width: responsive.wp(2),
    height: responsive.wp(2),
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
  },
  severityText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scanMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  metaText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginLeft: SPACING.xs,
  },
  timeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[500],
  },
});
