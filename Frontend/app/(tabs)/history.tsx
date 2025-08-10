import { Calendar, Filter, TrendingUp, Activity, BarChart3, TrendingDown, Search, ArrowUpRight, Clock, Shield, ChevronDown, Trash2 } from "lucide-react-native";
import { Image, ScrollView, StyleSheet, TouchableOpacity, Animated, Easing, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ANIMATIONS } from '@/constants/DesignSystem';
import { useEffect, useRef, useState } from 'react';
import { useScanData } from '@/contexts/ScanContext';
import { ScanResult } from '@/types/scan';

const safeArea = getSafeAreaInsets();

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { scans, stats, deleteScan, isLoading } = useScanData();
  
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

  // Handle scan deletion
  const handleDeleteScan = (scanId: string, scanLabel: string) => {
    Alert.alert(
      'Delete Scan',
      `Are you sure you want to delete the ${scanLabel} scan? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScan(scanId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete scan. Please try again.');
            }
          },
        },
      ],
    );
  };

  // Filter scans based on selected filter
  const filteredScans = scans.filter(scan => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Healthy') return scan.severity === 'None';
    return scan.severity === selectedFilter;
  });

  // Sort scans by creation time (most recent first)
  const sortedScans = filteredScans.sort((a, b) => b.createdAt - a.createdAt);

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

  // Helper functions for risk level colors
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return COLORS.accent.emerald;
      case 'Medium': return COLORS.accent.amber;
      case 'High': return COLORS.error;
      default: return COLORS.neutral[500];
    }
  };

  const filterOptions = ['All', 'Healthy', 'Mild', 'Moderate', 'Severe'];

  const renderScanCard = ({ item: scan, index }: { item: ScanResult, index: number }) => (
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
          <Image source={{ uri: scan.imageUri }} style={styles.scanImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.scanImageOverlay}
          />
          <ThemedView style={styles.confidenceBadge}>
            <Shield size={responsive.wp(3)} color={COLORS.primary[600]} />
            <ThemedText style={styles.confidenceText}>{scan.accuracy}%</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.scanContent}>
          <ThemedView style={styles.scanHeader}>
            <ThemedText style={styles.scanCondition}>{scan.label}</ThemedText>
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
        
        <TouchableOpacity 
          onPress={() => handleDeleteScan(scan.id, scan.label)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Trash2 size={responsive.wp(5)} color={COLORS.error} strokeWidth={2} />
        </TouchableOpacity>
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
          <ThemedView style={styles.subtitleBox}>
          <ThemedText style={styles.subtitle}>Track your skin health journey</ThemedText>
          </ThemedView>
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
            <ThemedText style={styles.summaryValue}>{stats.totalScans}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Scans</ThemedText>
          </ThemedView>
        </LinearGradient>
        
        <LinearGradient
          colors={COLORS.gradients.secondary}
          style={styles.summaryCard}
        >
          <Activity size={responsive.wp(7)} color={COLORS.neutral[0]} strokeWidth={2.5} />
          <ThemedView style={styles.summaryInfo}>
            <ThemedText style={styles.summaryValue}>{stats.healthyCount}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Healthy</ThemedText>
          </ThemedView>
        </LinearGradient>
        
        <LinearGradient
          colors={COLORS.gradients.accent}
          style={styles.summaryCard}
        >
          <BarChart3 size={responsive.wp(7)} color={COLORS.neutral[0]} strokeWidth={2.5} />
          <ThemedView style={styles.summaryInfo}>
            <ThemedText style={styles.summaryValue}>{stats.averageAccuracy}%</ThemedText>
            <ThemedText style={styles.summaryLabel}>Accuracy</ThemedText>
          </ThemedView>
        </LinearGradient>
      </Animated.View>

      {/* Enhanced Disease Statistics */}
      {stats.diseaseStats.length > 0 && (
        <Animated.View style={[
          styles.diseaseStatsContainer,
          { opacity: fadeAnim }
        ]}>
          <ThemedView style={styles.diseaseStatsHeader}>
            <ThemedText style={styles.diseaseStatsTitle}>Disease Breakdown 📈</ThemedText>
            <ThemedText style={styles.diseaseStatsSubtitle}>Detailed analysis of detected conditions</ThemedText>
          </ThemedView>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.diseaseStatsList}>
            {stats.diseaseStats.map((disease, index) => (
              <TouchableOpacity key={disease.name} style={styles.diseaseStatCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={[COLORS.primary[100], COLORS.primary[200]]}
                  style={styles.diseaseStatHeader}
                >
                  <ThemedText style={styles.diseaseStatName}>{disease.name}</ThemedText>
                  <ThemedText style={styles.diseaseStatCount}>{disease.count}</ThemedText>
                </LinearGradient>
                
                <ThemedView style={styles.diseaseStatContent}>
                  <ThemedView style={styles.diseaseStatRow}>
                    <ThemedText style={styles.diseaseStatLabel}>Accuracy</ThemedText>
                    <ThemedText style={styles.diseaseStatValue}>{disease.averageAccuracy}%</ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.diseaseStatRow}>
                    <ThemedText style={styles.diseaseStatLabel}>Last Detected</ThemedText>
                    <ThemedText style={styles.diseaseStatValue}>{disease.lastDetected}</ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.severityChart}>
                    <ThemedText style={styles.severityChartTitle}>Severity Distribution</ThemedText>
                    <ThemedView style={styles.severityChartBars}>
                      {Object.entries(disease.severityBreakdown).map(([severity, count]) => (
                        count > 0 && (
                          <ThemedView key={severity} style={styles.severityChartBar}>
                            <ThemedView style={[
                              styles.severityBarFill,
                              { 
                                height: Math.max(20, (count / Math.max(...Object.values(disease.severityBreakdown))) * 40),
                                backgroundColor: getSeverityColor(severity)
                              }
                            ]} />
                            <ThemedText style={styles.severityBarLabel}>{severity}</ThemedText>
                            <ThemedText style={styles.severityBarValue}>{count}</ThemedText>
                          </ThemedView>
                        )
                      ))}
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Severity Distribution Chart */}
      <Animated.View style={[
        styles.severityChartContainer,
        { opacity: scaleAnim }
      ]}>
        <ThemedView style={styles.severityChartHeader}>
          <ThemedText style={styles.severityChartTitle}>Overall Severity Distribution</ThemedText>
          <ThemedText style={styles.severityChartSubtitle}>Risk assessment overview</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.severityChartContent}>
          {Object.entries(stats.severityDistribution).map(([severity, count]) => (
            count > 0 && (
              <ThemedView key={severity} style={styles.severityChartRow}>
                <ThemedView style={styles.severityChartLabel}>
                  <ThemedView style={[styles.severityDot, { backgroundColor: getSeverityColor(severity) }]} />
                  <ThemedText style={styles.severityChartText}>{severity}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.severityChartBar}>
                  <LinearGradient
                    colors={[getSeverityColor(severity) + '20', getSeverityColor(severity) + '40']}
                    style={[
                      styles.severityChartBarFill,
                      { width: `${(count / stats.totalScans) * 100}%` }
                    ]}
                  />
                  <ThemedText style={styles.severityChartCount}>{count}</ThemedText>
                </ThemedView>
              </ThemedView>
            )
          ))}
        </ThemedView>
        
        <ThemedView style={styles.riskAssessment}>
          <ThemedText style={styles.riskAssessmentTitle}>Risk Assessment</ThemedText>
          <ThemedView style={[styles.riskLevelBadge, { backgroundColor: getRiskLevelColor(stats.riskLevel) + '20' }]}>
            <ThemedText style={[styles.riskLevelText, { color: getRiskLevelColor(stats.riskLevel) }]}>
              {stats.riskLevel} Risk
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.riskAssessmentSubtitle}>
            Based on {stats.totalScans} scans • Trend: {stats.improvementTrend}
          </ThemedText>
        </ThemedView>
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
      {sortedScans.length > 0 ? (
        <FlatList
          data={sortedScans}
          renderItem={renderScanCard}
          keyExtractor={(item) => item.id}
          style={styles.scanList}
          contentContainerStyle={styles.scanListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            {selectedFilter === 'All' ? 'No scans yet' : `No ${selectedFilter.toLowerCase()} scans found`}
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            {selectedFilter === 'All' 
              ? 'Start by taking your first skin analysis' 
              : 'Try selecting a different filter or take more scans'
            }
          </ThemedText>
        </ThemedView>
      )}
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
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
    lineHeight: TYPOGRAPHY.sizes.xl * 1.2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs / 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  actionButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: responsive.wp(8),
    height: responsive.wp(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.lg,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  summaryCard: {
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryInfo: {
    marginLeft: SPACING.sm,
    backgroundColor: 'transparent',
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[0],
    lineHeight: TYPOGRAPHY.sizes.lg * 1.1,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.surface.primary,
    marginTop: SPACING.xs / 2,
    opacity: 0.9,
  },
  filterContainer: {
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  filterPillActive: {
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },
  filterText: {
    fontSize: TYPOGRAPHY.sizes.xs,
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
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  scanCard: {
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  scanImageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  scanImage: {
    width: responsive.wp(12),
    height: responsive.wp(12),
    borderRadius: RADIUS.md,
  },
  scanImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
  },
  confidenceBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: SPACING.xs,
    backgroundColor: 'transparent',
  },
  scanCondition: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    flex: 1,
    marginRight: SPACING.xs,
    lineHeight: TYPOGRAPHY.sizes.base * 1.2,
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.sm,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs / 2,
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
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginLeft: SPACING.xs / 2,
  },
  timeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[500],
  },
  deleteButton: {
    padding: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.error + '10',
    marginLeft: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[600],
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[400],
    textAlign: 'center',
  },
  diseaseStatsContainer: {
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  diseaseStatsHeader: {
    marginBottom: SPACING.md,
  },
  diseaseStatsTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
    lineHeight: TYPOGRAPHY.sizes.lg * 1.2,
  },
  diseaseStatsSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs / 2,
  },
  diseaseStatsList: {
    gap: SPACING.md,
  },
  diseaseStatCard: {
    backgroundColor: COLORS.surface.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: responsive.wp(40), // Fixed width for horizontal scroll
    alignItems: 'center',
  },
  diseaseStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.xs,
  },
  diseaseStatName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[800],
    flex: 1,
    marginRight: SPACING.xs,
  },
  diseaseStatCount: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.primary[600],
  },
  diseaseStatContent: {
    width: '100%',
  },
  diseaseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs / 2,
  },
  diseaseStatLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[600],
  },
  diseaseStatValue: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[800],
  },
  severityChart: {
    marginTop: SPACING.md,
    width: '100%',
  },
  severityChartTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs / 2,
  },
  severityChartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
  },
  severityChartBar: {
    alignItems: 'center',
    width: responsive.wp(10), // Fixed width for bars
  },
  severityBarFill: {
    width: '100%',
    borderRadius: RADIUS.sm,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  severityBarLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[600],
    marginTop: SPACING.xs / 2,
  },
  severityBarValue: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[800],
  },
  severityChartContainer: {
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  severityChartHeader: {
    marginBottom: SPACING.md,
  },
  severityChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
    backgroundColor: COLORS.neutral[100],
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
  severityChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  severityChartLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityChartText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[600],
    marginLeft: SPACING.xs / 2,
  },
  severityChartBar: {
    height: 20,
    width: responsive.wp(15), // Fixed width for bars
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  severityChartBarFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: RADIUS.sm,
  },
  severityChartCount: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[800],
    marginTop: SPACING.xs / 2,
  },
  riskAssessment: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  riskAssessmentTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs / 2,
  },
  riskLevelBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.md,
  },
  riskLevelText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.semibold,
  },
  riskAssessmentSubtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[500],
  },
});
