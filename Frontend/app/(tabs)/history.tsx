import { Calendar, Filter, TrendingUp } from "lucide-react-native";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from '@/hooks/useTheme'; // Import useTheme hook

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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
  },
  headerActions: { flexDirection: "row" },
  actionButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    // Moved shadow properties from cardStyle
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, // Default for light mode
    shadowRadius: 3,
    elevation: 2,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    // Moved shadow properties from cardStyle
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, // Default for light mode
    shadowRadius: 3,
    elevation: 2,
  },
  summaryInfo: { marginLeft: 12 },
  summaryValue: { fontSize: 20, fontFamily: "Inter-Bold" },
  summaryLabel: { fontSize: 12, fontFamily: "Inter-Regular", marginTop: 2 },
  healthIndicator: { width: 24, height: 24, borderRadius: 12 },
  scanList: { paddingHorizontal: 20 },
  scanCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
    // Moved shadow properties from cardStyle
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, // Default for light mode
    shadowRadius: 3,
    elevation: 2,
  },
  scanImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  scanDetails: { flex: 1 },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  scanCondition: { fontSize: 16, fontFamily: "Inter-SemiBold", flex: 1 },
  confidenceBadge: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#0369a1",
  },
  scanMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanDate: { fontSize: 14, fontFamily: "Inter-Regular" },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  severityText: { fontSize: 12, fontFamily: "Inter-Medium" },
});
