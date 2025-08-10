import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from "expo-router";
import {
  Camera as CameraIcon,
  Info,
  Image as ImageIcon,
  Scan,
  ArrowLeft,
  Sparkles,
  X,
  CheckCircle,
  Camera,
  Upload,
  Brain,
  Shield,
} from "lucide-react-native";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { responsive, getSafeAreaInsets } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '@/constants/DesignSystem';
import { useScanData } from '@/contexts/ScanContext';

// Add this import:


const safeArea = getSafeAreaInsets();

export default function ScanScreen() {
  const router = useRouter();
  const { addScan } = useScanData();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<
    "preparing" | "analyzing" | "finalizing"
  >("preparing");
  const [showTips, setShowTips] = useState(false);

  // State for tracking the current image
  const [selectedImage, setSelectedImage] = useState<{ uri: string; base64?: string } | null>(null);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission required', 'Camera access is needed to take photos.');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const base64 = asset.base64 || undefined;
        
        setSelectedImage({
          uri: imageUri,
          base64: base64
        });
        startAnalysis({ 
          uri: imageUri, 
          base64: base64 
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleUploadPhoto = async () => {
    await pickAndCropImage();
  };

  const startAnalysis = (image: { base64?: string; uri: string }) => {
    setIsAnalyzing(true);
    setAnalysisStep("preparing");

    setTimeout(() => {
      setAnalysisStep("analyzing");
      setTimeout(() => {
        setAnalysisStep("finalizing");
        setTimeout(() => {
          setIsAnalyzing(false);
          router.push({
            pathname: "/result",
            params: {
              image: image.base64,
              imageUri: image.uri,
            },
          });
        }, 500);
      }, 1000);
    }, 500);
  };

  const getStepLabel = () => {
    switch (analysisStep) {
      case "preparing": return "Preparing...";
      case "analyzing": return "Analyzing...";
      case "finalizing": return "Finalizing...";
    }
  };

  // Handle image picking and cropping
  const pickAndCropImage = async () => {
    try {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photos to select an image.');
        return;
      }

      // Launch the image picker with cropping
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        
        // Process the image with ImageManipulator if needed
        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 500 } }], // Resize to a reasonable size
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        // Update the selected image and start analysis
        setSelectedImage({
          uri: manipResult.uri,
          base64: manipResult.base64 || undefined
        });
        startAnalysis({ 
          uri: manipResult.uri, 
          base64: manipResult.base64 
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick or process the image.');
    }
  };

  // Remove the cropVisible state and related handlers
  // as we're now using the system's built-in image picker with cropping

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.analysisContainer}>
        <Sparkles size={48} color={COLORS.primary[500]} />
        <ThemedText style={styles.analysisText}>{getStepLabel()}</ThemedText>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              analysisStep === "preparing" && { width: "25%" },
              analysisStep === "analyzing" && { width: "70%" },
              analysisStep === "finalizing" && { width: "95%" },
            ]}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Scan</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {/* Camera Placeholder */}
      <View style={styles.preview}>
        <Scan size={48} color={COLORS.neutral[400]} />
        <ThemedText style={styles.placeholderText}>Place skin in frame</ThemedText>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleUploadPhoto} style={styles.controlButton}>
          <ImageIcon size={24} color={COLORS.primary[500]} />
          <ThemedText style={styles.controlText}>Upload</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleTakePhoto}
          activeOpacity={0.8}
        >
          <CameraIcon size={28} color={COLORS.neutral[0]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setShowTips(true)}
        >
          <Info size={24} color={COLORS.primary[500]} />
          <ThemedText style={styles.controlText}>Tips</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Tips Modal */}
      <Modal
        visible={showTips}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTips(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>How to Use Skin_oAi</ThemedText>
            <TouchableOpacity 
              onPress={() => setShowTips(false)}
              style={styles.closeButton}
            >
              <X size={24} color={COLORS.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Step 1: Preparation */}
            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>1</ThemedText>
                </View>
                <ThemedText style={styles.tipTitle}>Prepare Your Skin</ThemedText>
              </View>
              <ThemedText style={styles.tipDescription}>
                Clean the affected area and ensure good lighting. Remove any makeup, creams, or bandages.
              </ThemedText>
              <View style={styles.tipIcon}>
                <Shield size={20} color={COLORS.accent.blue} />
              </View>
            </View>

            {/* Step 2: Capture */}
            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>2</ThemedText>
                </View>
                <ThemedText style={styles.tipTitle}>Capture the Image</ThemedText>
              </View>
              <ThemedText style={styles.tipDescription}>
                Use the camera button to take a photo or upload button to select from gallery. Ensure the skin condition is clearly visible.
              </ThemedText>
              <View style={styles.tipIcon}>
                <Camera size={20} color={COLORS.primary[500]} />
              </View>
            </View>

            {/* Step 3: Analysis */}
            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>3</ThemedText>
                </View>
                <ThemedText style={styles.tipTitle}>AI Analysis</ThemedText>
              </View>
              <ThemedText style={styles.tipDescription}>
                Our advanced AI will analyze your image and provide detailed results including condition type, severity, and accuracy.
              </ThemedText>
              <View style={styles.tipIcon}>
                <Brain size={20} color={COLORS.accent.purple} />
              </View>
            </View>

            {/* Step 4: Results */}
            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>4</ThemedText>
                </View>
                <ThemedText style={styles.tipTitle}>Get Results</ThemedText>
              </View>
              <ThemedText style={styles.tipDescription}>
                Review your detailed analysis, track your progress over time, and get personalized recommendations for skin health.
              </ThemedText>
              <View style={styles.tipIcon}>
                <CheckCircle size={20} color={COLORS.accent.emerald} />
              </View>
            </View>

            {/* Best Practices */}
            <View style={styles.bestPracticesSection}>
              <ThemedText style={styles.bestPracticesTitle}>Best Practices</ThemedText>
              <View style={styles.bestPracticeItem}>
                <View style={styles.bestPracticeDot} />
                <ThemedText style={styles.bestPracticeText}>
                  Take photos in natural daylight for best results
                </ThemedText>
              </View>
              <View style={styles.bestPracticeItem}>
                <View style={styles.bestPracticeDot} />
                <ThemedText style={styles.bestPracticeText}>
                  Keep the camera steady and close to the skin
                </ThemedText>
              </View>
              <View style={styles.bestPracticeItem}>
                <View style={styles.bestPracticeDot} />
                <ThemedText style={styles.bestPracticeText}>
                  Avoid shadows or reflections on the skin
                </ThemedText>
              </View>
              <View style={styles.bestPracticeItem}>
                <View style={styles.bestPracticeDot} />
                <ThemedText style={styles.bestPracticeText}>
                  Scan regularly to track changes over time
                </ThemedText>
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerSection}>
              <ThemedText style={styles.disclaimerText}>
                ⚠️ This app is for educational purposes only. Always consult with a healthcare professional for medical advice.
              </ThemedText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
  },
  preview: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SPACING.lg,
  },
  placeholderText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.neutral[500],
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: SPACING.lg,
  },
  controlButton: {
    alignItems: "center",
  },
  controlText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    marginTop: 4,
    color: COLORS.primary[500],
  },
  captureButton: {
    width: responsive.wp(18),
    height: responsive.wp(18),
    borderRadius: 999,
    backgroundColor: COLORS.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    width: responsive.wp(18),
    height: responsive.wp(18),
    borderRadius: 999,
    backgroundColor: COLORS.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  analysisContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.neutral[50],
    gap: SPACING.md,
  },
  analysisText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[800],
  },
  progressTrack: {
    width: "70%",
    height: 6,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary[500],
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[900],
  },
  closeButton: {
    padding: SPACING.sm,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  tipSection: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  stepNumberText: {
    color: COLORS.neutral[0],
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.bold,
  },
  tipTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[900],
    flex: 1,
  },
  tipDescription: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[700],
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  tipIcon: {
    alignSelf: 'flex-end',
  },
  bestPracticesSection: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  bestPracticesTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[900],
    marginBottom: SPACING.md,
  },
  bestPracticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bestPracticeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary[500],
    marginRight: SPACING.sm,
  },
  bestPracticeText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[700],
    flex: 1,
  },
  disclaimerSection: {
    backgroundColor: COLORS.accent.orange + '15',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.accent.orange + '30',
  },
  disclaimerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.accent.orange,
    textAlign: 'center',
    lineHeight: 20,
  },
});
