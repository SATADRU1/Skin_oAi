import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Camera as CameraIcon,
  FlipHorizontal,
  Info,
  Upload,
  X,
  Zap,
} from "lucide-react-native";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<
    "preparing" | "analyzing" | "finalizing"
  >("preparing");

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need camera permission to take photos.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        console.log('Camera was cancelled');
        return;
      }

      if (!result.assets || !result.assets[0] || !result.assets[0].base64) {
        Alert.alert("Camera Error", "No image data captured. Please try again.");
        return;
      }

      console.log('Camera success:', {
        hasBase64: !!result.assets[0].base64,
        base64Length: result.assets[0].base64?.length
      });

      // Start analysis
      setIsAnalyzing(true);
      setAnalysisStep("preparing");
      
      // Simulate analysis steps
      setTimeout(() => {
        setAnalysisStep("analyzing");
        setTimeout(() => {
          setAnalysisStep("finalizing");
          setTimeout(() => {
            setIsAnalyzing(false);
            router.push({
              pathname: "/result",
              params: {
                image: result.assets[0].base64,
                text: "",
              },
            });
          }, 500);
        }, 1000);
      }, 500);

    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        "Camera Error",
        `Failed to take photo: ${(error as any)?.message || "Please try again."}`
      );
    }
  };
