import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Award,
  Camera,
  Clock,
  Scan,
  Shield,
  TrendingUp,
} from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';

const safeArea = getSafeAreaInsets();

export default function HomeScreen() {
  const router = useRouter();

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
    { icon: Scan, label: "Total Scans", value: "4", color: "#3b82f6" },
    { icon: TrendingUp, label: "Accuracy", value: "94%", color: "#10b981" },
    { icon: Shield, label: "Reliability", value: "99%", color: "#8b5cf6" },
  ];

  return (
    // Replace SafeAreaView with ThemedView
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView>
            <ThemedText style={styles.greeting}>Hello there!</ThemedText>
            <ThemedText style={styles.subtitle}>How can I help you today?</ThemedText>
          </ThemedView>
          <ThemedView style={styles.profileIcon}>
            <Award size={24} color="#3b82f6" />
          </ThemedView>
        </ThemedView>

        {/* Main Scan Button */}
        <TouchableOpacity
          style={styles.scanButtonContainer}
          onPress={() => router.push("/scan")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.scanButton}
          >
            <ThemedView style={styles.scanIconContainer}>
              <Camera size={32} color="#ffffff" strokeWidth={2.5} />
            </ThemedView>
            <ThemedView style={styles.scanContent} lightColor="transparent" darkColor="transparent">
              <ThemedText style={styles.scanButtonText}>New Scan</ThemedText>
              <ThemedText style={styles.scanButtonSubtitle}>
                Analyze your skin condition
              </ThemedText>
            </ThemedView>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Section */}
        <ThemedView style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <ThemedView key={index} style={styles.statCard}>
              <ThemedView style={[styles.statIconWrapper, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </ThemedView>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Recent Scans Section */}
        <ThemedView style={styles.recentScansHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Scans</ThemedText>
          <TouchableOpacity onPress={() => router.push("/history")}>
            <ThemedText style={styles.viewAllText}>View All</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentScansList}
        >
          {recentScans.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              style={styles.scanCard}
              onPress={() => router.push({ pathname: "/result", params: { image: scan.image, text: scan.condition } })}
            >
              <Image source={{ uri: scan.image }} style={styles.scanImage} />
              <ThemedView style={styles.scanCardContent}>
                <ThemedText style={styles.scanCondition}>{scan.condition}</ThemedText>
                <ThemedView style={styles.scanDetails}>
                  <Clock size={14} color="#6b7280" />
                  <ThemedText style={styles.scanDate}>{scan.date}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.scanDetails}>
                  <Shield size={14} color="#6b7280" />
                  <ThemedText style={styles.scanConfidence}>
                    Confidence: {scan.confidence}%
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsive.wp(5),
    paddingVertical: responsive.hp(2.5),
  },
  greeting: {
    fontSize: scaleFont(24),
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: scaleFont(16),
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  profileIcon: {
    width: responsive.wp(12),
    height: responsive.wp(12),
    borderRadius: responsive.wp(6),
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonContainer: {
    marginHorizontal: responsive.wp(5),
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: responsive.hp(3),
    elevation: 5,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: responsive.wp(5),
  },
  scanIconContainer: {
    width: responsive.wp(15),
    height: responsive.wp(15),
    borderRadius: responsive.wp(7.5),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  scanContent: {
    flex: 1,
  },
  scanButtonText: {
    fontSize: scaleFont(22),
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  scanButtonSubtitle: {
    fontSize: scaleFont(14),
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: responsive.wp(5),
    marginBottom: responsive.hp(3),
    borderRadius: 15,
    paddingVertical: responsive.hp(2.5),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statCard: {
    alignItems: "center",
  },
  statIconWrapper: {
    width: responsive.wp(12),
    height: responsive.wp(12),
    borderRadius: responsive.wp(6),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: scaleFont(20),
    fontFamily: "Inter-Bold",
  },
  statLabel: {
    fontSize: scaleFont(14),
    fontFamily: "Inter-Regular",
  },
  recentScansHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: responsive.wp(5),
    marginBottom: responsive.hp(2),
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontFamily: "Inter-SemiBold",
  },
  viewAllText: {
    fontSize: scaleFont(14),
    fontFamily: "Inter-Medium",
    color: "#3b82f6",
  },
  recentScansList: {
    paddingHorizontal: responsive.wp(5),
    paddingBottom: responsive.hp(2),
  },
  scanCard: {
    width: responsive.wp(40),
    marginRight: responsive.wp(4),
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  scanImage: {
    width: "100%",
    height: responsive.hp(15),
    resizeMode: "cover",
  },
  scanCardContent: {
    padding: responsive.wp(3),
  },
  scanCondition: {
    fontSize: scaleFont(16),
    fontFamily: "Inter-SemiBold",
    marginBottom: 5,
  },
  scanDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  scanDate: {
    fontSize: scaleFont(12),
    fontFamily: "Inter-Regular",
    marginLeft: 5,
  },
  scanConfidence: {
    fontSize: scaleFont(12),
    fontFamily: "Inter-Regular",
    marginLeft: 5,
  },
});
