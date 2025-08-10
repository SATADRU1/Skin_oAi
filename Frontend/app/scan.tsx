import React, { useState, useRef, useEffect } from "react";
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
  Sparkles,
  Shield,
  Eye,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
  Image as ImageIcon,
  Scan,
} from "lucide-react-native";
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { scaleFont, responsive, getSafeAreaInsets } from '@/utils/responsive';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ANIMATIONS } from '@/constants/DesignSystem';

const { width, height } = Dimensions.get("window");
const safeArea = getSafeAreaInsets();

export default function ScanScreen() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<
    "preparing" | "analyzing" | "finalizing"
  >("preparing");
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanFrameAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATIONS.normal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
    
    // Scan frame pulse animation
    const scanPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scanFrameAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scanFrameAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    );
    
    const buttonPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    );
    
    scanPulse.start();
    buttonPulse.start();
    
    return () => {
      scanPulse.stop();
      buttonPulse.stop();
    };
  }, []);

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
      <ThemedView style={styles.analyzingContainer}>
        <LinearGradient
          colors={COLORS.gradients.primary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.analyzingBackground}
        >
          <Animated.View style={[
            styles.analyzingContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* AI Analysis Icon */}
            <Animated.View style={[
              styles.analyzeIconContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}>
              <LinearGradient
                colors={[COLORS.surface.glass, COLORS.surface.primary]}
                style={styles.analyzeIcon}
              >
                <Sparkles size={responsive.wp(12)} color={COLORS.neutral[0]} strokeWidth={2} />
              </LinearGradient>
            </Animated.View>
            
            <ThemedText style={styles.analyzingTitle}>🔬 AI Analysis in Progress</ThemedText>
            <ThemedText style={styles.analyzingSubtitle}>{getAnalysisStepText()}</ThemedText>
            
            {/* Enhanced Progress Bar */}
            <ThemedView style={styles.progressContainer}>
              <ThemedView style={styles.progressBar}>
                <Animated.View style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', getAnalysisProgress()],
                    })
                  }
                ]} />
                <LinearGradient
                  colors={COLORS.gradients.secondary}
                  style={[
                    styles.progressGradient,
                    { width: getAnalysisProgress() }
                  ]}
                />
              </ThemedView>
              <ThemedText style={styles.progressText}>
                {getAnalysisProgress()} Complete
              </ThemedText>
            </ThemedView>
            
            {/* Modern Step Indicators */}
            <ThemedView style={styles.analysisSteps}>
              <ThemedView style={[
                styles.stepIndicator,
                analysisStep === "preparing" && styles.activeStep,
              ]}>
                <Target size={responsive.wp(4)} color={analysisStep === "preparing" ? COLORS.secondary[500] : COLORS.surface.primary} />
                <ThemedText style={[
                  styles.stepText,
                  analysisStep === "preparing" && styles.activeStepText
                ]}>Preparing</ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.stepIndicator,
                analysisStep === "analyzing" && styles.activeStep,
              ]}>
                <Zap size={responsive.wp(4)} color={analysisStep === "analyzing" ? COLORS.secondary[500] : COLORS.surface.primary} />
                <ThemedText style={[
                  styles.stepText,
                  analysisStep === "analyzing" && styles.activeStepText
                ]}>Analyzing</ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.stepIndicator,
                analysisStep === "finalizing" && styles.activeStep,
              ]}>
                <CheckCircle size={responsive.wp(4)} color={analysisStep === "finalizing" ? COLORS.secondary[500] : COLORS.surface.primary} />
                <ThemedText style={[
                  styles.stepText,
                  analysisStep === "finalizing" && styles.activeStepText
                ]}>Finalizing</ThemedText>
              </ThemedView>
            </ThemedView>
          </Animated.View>
        </LinearGradient>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      >
        {/* Modern Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <LinearGradient
              colors={[COLORS.surface.glass, COLORS.surface.primary]}
              style={styles.backButtonGradient}
            >
              <ArrowLeft size={responsive.wp(6)} color={COLORS.neutral[0]} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>📷 AI Skin Scanner</ThemedText>
          <ThemedView style={styles.headerPlaceholder} />
        </Animated.View>

        {/* Enhanced Camera Preview */}
        <Animated.View style={[
          styles.cameraContainer,
          {
            opacity: scaleAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <LinearGradient
            colors={[COLORS.neutral[800], COLORS.neutral[700]]}
            style={styles.cameraPlaceholder}
          >
            <Animated.View style={[
              styles.cameraIconContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}>
              <Scan size={responsive.wp(16)} color={COLORS.primary[400]} strokeWidth={1.5} />
            </Animated.View>
            <ThemedText style={styles.cameraPlaceholderText}>
              Camera will appear here
            </ThemedText>
          </LinearGradient>
          
          {/* Enhanced Overlay */}
          <ThemedView style={styles.overlay}>
            <Animated.View style={[
              styles.scanFrame,
              {
                transform: [{ scale: scanFrameAnim }]
              }
            ]} />
            <ThemedView style={styles.scanCorners}>
              <ThemedView style={[styles.corner, styles.topLeft]} />
              <ThemedView style={[styles.corner, styles.topRight]} />
              <ThemedView style={[styles.corner, styles.bottomLeft]} />
              <ThemedView style={[styles.corner, styles.bottomRight]} />
            </ThemedView>
            <ThemedText style={styles.overlayText}>
              🎯 Position the affected area within the frame
            </ThemedText>
            <ThemedText style={styles.overlaySubtext}>
              AI will analyze your skin condition
            </ThemedText>
          </ThemedView>
        </Animated.View>

        {/* Enhanced Instructions */}
        <Animated.View style={[
          styles.instructionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ThemedView style={styles.instructionCard}>
            <ThemedView style={styles.instructionItem}>
              <LinearGradient
                colors={[COLORS.accent.amber + '30', COLORS.accent.amber + '20']}
                style={styles.instructionIconContainer}
              >
                <Lightbulb size={responsive.wp(4)} color={COLORS.accent.amber} />
              </LinearGradient>
              <ThemedText style={styles.instructionText}>Ensure good lighting and clear focus</ThemedText>
            </ThemedView>
            <ThemedView style={styles.instructionItem}>
              <LinearGradient
                colors={[COLORS.secondary[500] + '30', COLORS.secondary[500] + '20']}
                style={styles.instructionIconContainer}
              >
                <Eye size={responsive.wp(4)} color={COLORS.secondary[500]} />
              </LinearGradient>
              <ThemedText style={styles.instructionText}>Keep the camera steady for best results</ThemedText>
            </ThemedView>
          </ThemedView>
        </Animated.View>

        {/* Enhanced Controls */}
        <Animated.View style={[
          styles.controls,
          {
            opacity: scaleAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleUploadPhoto}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.accent.cyan + '30', COLORS.accent.cyan + '20']}
              style={styles.uploadIconContainer}
            >
              <ImageIcon size={responsive.wp(6)} color={COLORS.accent.cyan} strokeWidth={2} />
            </LinearGradient>
            <ThemedText style={styles.uploadText}>Upload</ThemedText>
          </TouchableOpacity>

          <Animated.View style={[{
            transform: [{ scale: pulseAnim }]
          }]}>
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={handleTakePhoto}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.captureGradient}
              >
                <ThemedView style={styles.captureInner}>
                  <CameraIcon size={responsive.wp(8)} color={COLORS.neutral[0]} strokeWidth={2.5} />
                </ThemedView>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.uploadButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.accent.emerald + '30', COLORS.accent.emerald + '20']}
              style={styles.uploadIconContainer}
            >
              <Shield size={responsive.wp(6)} color={COLORS.accent.emerald} strokeWidth={2} />
            </LinearGradient>
            <ThemedText style={styles.uploadText}>Guide</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
  },
  backgroundGradient: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: 'transparent',
  },
  backButton: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  backButtonGradient: {
    width: responsive.wp(12),
    height: responsive.wp(12),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.full,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[0],
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: responsive.wp(12),
    backgroundColor: 'transparent',
  },

  // Camera Styles
  cameraContainer: {
    flex: 1,
    margin: SPACING.lg,
    borderRadius: RADIUS['2xl'],
    overflow: "hidden",
    ...SHADOWS.xl,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconContainer: {
    marginBottom: SPACING.lg,
  },
  cameraPlaceholderText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.neutral[400],
  },

  // Overlay Styles
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface.overlay,
    zIndex: 1,
  },
  scanFrame: {
    width: responsive.wp(65),
    height: responsive.wp(65),
    borderWidth: 3,
    borderColor: COLORS.primary[400],
    borderRadius: RADIUS['2xl'],
    backgroundColor: "transparent",
  },
  scanCorners: {
    position: 'absolute',
    width: responsive.wp(65),
    height: responsive.wp(65),
  },
  corner: {
    position: 'absolute',
    width: responsive.wp(6),
    height: responsive.wp(6),
    borderColor: COLORS.secondary[400],
    borderWidth: 4,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  overlayText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[0],
    textAlign: "center",
    marginTop: SPACING['2xl'],
    paddingHorizontal: SPACING['2xl'],
  },
  overlaySubtext: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.surface.primary,
    textAlign: "center",
    marginTop: SPACING.sm,
    opacity: 0.8,
  },

  // Instructions
  instructionsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  instructionCard: {
    backgroundColor: COLORS.surface.glass,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  instructionIconContainer: {
    width: responsive.wp(10),
    height: responsive.wp(10),
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.neutral[0],
    flex: 1,
    lineHeight: TYPOGRAPHY.sizes.base * 1.4,
  },

  // Controls
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['2xl'],
    backgroundColor: COLORS.surface.overlay,
  },
  uploadButton: {
    alignItems: "center",
    width: responsive.wp(20),
  },
  uploadIconContainer: {
    width: responsive.wp(14),
    height: responsive.wp(14),
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOWS.lg,
  },
  uploadText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.neutral[0],
  },
  captureButton: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },
  captureGradient: {
    width: responsive.wp(20),
    height: responsive.wp(20),
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: responsive.wp(16),
    height: responsive.wp(16),
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface.glass,
    justifyContent: "center",
    alignItems: "center",
  },

  // Analyzing State
  analyzingContainer: {
    flex: 1,
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
  },
  analyzingBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingContent: {
    alignItems: "center",
    paddingHorizontal: SPACING['2xl'],
  },
  analyzeIconContainer: {
    marginBottom: SPACING['3xl'],
  },
  analyzeIcon: {
    width: responsive.wp(24),
    height: responsive.wp(24),
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.xl,
  },
  analyzingTitle: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontFamily: TYPOGRAPHY.families.bold,
    color: COLORS.neutral[0],
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: TYPOGRAPHY.sizes['3xl'] * 1.2,
  },
  analyzingSubtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.families.regular,
    color: COLORS.surface.primary,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.sizes.lg * 1.4,
    marginBottom: SPACING['3xl'],
    opacity: 0.9,
  },

  // Progress
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING['3xl'],
    backgroundColor: 'transparent',
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: COLORS.surface.glass,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: "100%",
    borderRadius: RADIUS.md,
  },
  progressGradient: {
    position: 'absolute',
    height: "100%",
    borderRadius: RADIUS.md,
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.families.semibold,
    color: COLORS.surface.primary,
    opacity: 0.9,
  },

  // Step Indicators
  analysisSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'transparent',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface.glass,
    borderWidth: 1,
    borderColor: COLORS.surface.primary,
  },
  activeStep: {
    backgroundColor: COLORS.secondary[500] + '30',
    borderColor: COLORS.secondary[500],
  },
  stepText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.families.medium,
    color: COLORS.surface.primary,
    marginLeft: SPACING.xs,
  },
  activeStepText: {
    color: COLORS.secondary[500],
    fontFamily: TYPOGRAPHY.families.semibold,
  },
});
