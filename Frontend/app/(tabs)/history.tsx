import { Calendar, Filter, TrendingUp, Activity, BarChart3, TrendingDown } from "lucide-react-native";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from '@/hooks/useTheme';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';

const safeArea = getSafeAreaInsets();

export default function HistoryScreen() {
  const { theme } = useTheme(); // Use the global theme hook
  const isDark = theme === "dark";

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
        return "#10b981";
      case "Mild":
        return "#f59e0b";
      case "Moderate":
        return "#ef4444";
      case "Severe":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  // Removed cardStyle constant, applying colors directly to ThemedView props

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Scan History</ThemedText>
        <ThemedView style={styles.headerActions}>
          <TouchableOpacity>
            {/* Apply themed background and shadows directly */}
            <ThemedView
              style={styles.actionButton}
              lightColor="rgba(255,255,255,0.9)"
              darkColor="rgba(255,255,255,0.05)"
            >
              <Filter size={20} color="#6b7280" />
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            {/* Apply themed background and shadows directly */}
            <ThemedView
              style={styles.actionButton}
              lightColor="rgba(255,255,255,0.9)"
              darkColor="rgba(255,255,255,0.05)"
            >
              <Calendar size={20} color="#6b7280" />
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Summary Stats */}
      <ThemedView style={styles.summaryContainer}>
        {/* Apply themed background and shadows directly */}
        <ThemedView
          style={styles.summaryCard}
          lightColor="rgba(255,255,255,0.9)"
          darkColor="rgba(255,255,255,0.05)"
        >
          <TrendingUp size={24} color="#3b82f6" />
          {/* Make summaryInfo background transparent */}
          <ThemedView style={styles.summaryInfo} lightColor="transparent" darkColor="transparent">
            <ThemedText style={styles.summaryValue}>{scans.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Scans</ThemedText>
          </ThemedView>
        </ThemedView>
        {/* Apply themed background and shadows directly */}
        <ThemedView
          style={styles.summaryCard}
          lightColor="rgba(255,255,255,0.9)"
          darkColor="rgba(255,255,255,0.05)"
        >
          <ThemedView
            style={[styles.healthIndicator, { backgroundColor: "#10b981" }]}
          />
          {/* Make summaryInfo background transparent */}
          <ThemedView style={styles.summaryInfo} lightColor="transparent" darkColor="transparent">
            <ThemedText style={styles.summaryValue}>
              {scans.filter((s) => s.severity === "None").length}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Healthy</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Scan List */}
      <ScrollView style={styles.scanList} showsVerticalScrollIndicator={false}>
        {scans.map((scan) => (
          <TouchableOpacity key={scan.id}>
            {/* Apply themed background and shadows directly */}
            <ThemedView
              style={styles.scanCard}
              lightColor="rgba(255,255,255,0.9)"
              darkColor="rgba(255,255,255,0.05)"
            >
              <Image source={{ uri: scan.image }} style={styles.scanImage} />
              {/* Make scanDetails background transparent */}
              <ThemedView style={styles.scanDetails} lightColor="transparent" darkColor="transparent">
                {/* Make scanHeader background transparent */}
                <ThemedView style={styles.scanHeader} lightColor="transparent" darkColor="transparent">
                  <ThemedText style={styles.scanCondition}>
                    {scan.condition}
                  </ThemedText>
                  <ThemedView style={styles.confidenceBadge}>
                    <ThemedText style={styles.confidenceText}>
                      {scan.confidence}%
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                {/* Make scanMeta background transparent */}
                <ThemedView style={styles.scanMeta} lightColor="transparent" darkColor="transparent">
                  <ThemedText style={styles.scanDate}>
                    {scan.date} • {scan.time}
                  </ThemedText>
                  <ThemedView
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(scan.severity) + "20" },
                    ]}
                  >
                    <ThemedView
                      style={[
                        styles.severityDot,
                        { backgroundColor: getSeverityColor(scan.severity) },
                      ]}
                    />
                    <ThemedText
                      style={[
                        styles.severityText,
                        { color: getSeverityColor(scan.severity) },
                      ]}
                    >
                      {scan.severity}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        ))}
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
  headerActions: { flexDirection: "row" },
  actionButton: {
    borderRadius: responsive.wp(5),
    width: responsive.wp(10),
    height: responsive.wp(10),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: responsive.wp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: responsive.wp(5),
    marginBottom: responsive.hp(3),
  },
  summaryCard: {
    borderRadius: 12,
    padding: responsive.wp(4),
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: responsive.wp(1),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryInfo: { marginLeft: responsive.wp(3) },
  summaryValue: { fontSize: scaleFont(20), fontFamily: "Inter-Bold" },
  summaryLabel: { fontSize: scaleFont(12), fontFamily: "Inter-Regular", marginTop: 2 },
  healthIndicator: { width: responsive.wp(6), height: responsive.wp(6), borderRadius: responsive.wp(3) },
  scanList: { paddingHorizontal: responsive.wp(5) },
  scanCard: {
    borderRadius: 12,
    padding: responsive.wp(4),
    flexDirection: "row",
    marginBottom: responsive.hp(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  scanImage: { 
    width: responsive.wp(15), 
    height: responsive.wp(15), 
    borderRadius: 8, 
    marginRight: responsive.wp(4) 
  },
  scanDetails: { flex: 1 },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  scanCondition: { fontSize: scaleFont(16), fontFamily: "Inter-SemiBold", flex: 1 },
  confidenceBadge: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: responsive.wp(2),
    paddingVertical: responsive.hp(0.5),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  confidenceText: {
    fontSize: scaleFont(12),
    fontFamily: "Inter-Medium",
    color: "#0369a1",
  },
  scanMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanDate: { fontSize: scaleFont(14), fontFamily: "Inter-Regular" },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsive.wp(2),
    paddingVertical: responsive.hp(0.5),
    borderRadius: 6,
  },
  severityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  severityText: { fontSize: scaleFont(12), fontFamily: "Inter-Medium" },
});
