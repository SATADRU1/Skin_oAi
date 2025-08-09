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
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const settingSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          title: "Dark Mode",
          subtitle: "Toggle dark theme",
          type: "switch",
          value: darkMode,
          onToggle: setDarkMode,
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
