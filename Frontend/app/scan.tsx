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

   // ✅pdated upto here -- 1st upload -- Soumyajit -- 3.31 AM -- 09/08/25

  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photo library to upload images for analysis.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
        allowsMultipleSelection: false,
      });

      if (result.canceled) {
        return;
      }

      if (!result.assets || !result.assets[0] || !result.assets[0].base64) {
        Alert.alert("Upload Error", "No image data selected. Please try again.");
        return;
      }

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
      setIsAnalyzing(false);
      Alert.alert(
        "Upload Error",
        `There was an error selecting your image. ${(error as any)?.message || "Please try again."}`,
        [{ text: "OK" }]
      );
    }
  };

  const getAnalysisStepText = () => {
    switch (analysisStep) {
      case "preparing":
        return "Preparing image for analysis...";
      case "analyzing":
        return "AI analyzing skin patterns...";
      case "finalizing":
        return "Generating detailed report...";
      default:
        return "Processing...";
    }
  };

  const getAnalysisProgress = () => {
    switch (analysisStep) {
      case "preparing":
        return "25%";
      case "analyzing":
        return "70%";
      case "finalizing":
        return "95%";
      default:
        return "0%";
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#1e40af", "#3b82f6"]}
          style={styles.analyzingContainer}
        >
          <View style={styles.analyzingContent}>
            <View style={styles.analyzeIcon}>
              <Zap size={48} color="#ffffff" />
            </View>
            <Text style={styles.analyzingTitle}>Analyzing Your Skin</Text>
            <Text style={styles.analyzingSubtitle}>{getAnalysisStepText()}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: getAnalysisProgress() },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {getAnalysisProgress()} Complete
              </Text>
            </View>
            <View style={styles.analysisSteps}>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "preparing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Preparing</Text>
              </View>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "analyzing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Analyzing</Text>
              </View>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "finalizing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Finalizing</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Your Skin</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera Preview Placeholder */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <CameraIcon size={64} color="#3b82f6" />
          <Text style={styles.cameraPlaceholderText}>
            Camera Preview
          </Text>
        </View>
        {/* Camera Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.overlayText}>
            Position the affected area within the frame
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <Info size={16} color="#3b82f6" />
          <Text style={styles.instructionText}>Ensure good lighting and clear focus</Text>
        </View>
        <View style={styles.instructionItem}>
          <Info size={16} color="#3b82f6" />
          <Text style={styles.instructionText}>Keep the camera steady for best results</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <View style={styles.uploadIconContainer}>
            <Upload size={20} color="#3b82f6" />
          </View>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={handleTakePhoto}
        >
          <View style={styles.captureInner}>
            <CameraIcon size={32} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1f2937",
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#374151",
  },
  cameraPlaceholderText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 12,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#3b82f6",
    borderRadius: 16,
    backgroundColor: "transparent",
    borderStyle: "dashed",
  },
  overlayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 40,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#ffffff",
    marginLeft: 8,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  uploadButton: {
    alignItems: "center",
    width: 80,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  uploadText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3b82f6",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1d4ed8",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  analyzeIcon: {
    width: 96,
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  analyzingTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  analyzingSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  analysisSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  stepIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  activeStep: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "#10b981",
  },
  stepText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
});