import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { predictSkinCondition, Recommendations } from '@/utils/api';

// Working version without context to avoid hook errors
export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Expecting params.image (base64 string) and params.imageUri (uri string)
  const imageBase64 = params.image as string | undefined;
  const imageUri = params.imageUri as string | undefined;
  const textInfo = params.text as string | undefined;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedRecommendations, setShowDetailedRecommendations] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!imageBase64) {
        setError('No image data provided.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const predictionResult = await predictSkinCondition(imageBase64);
        
        const analysisResult = { 
          ...predictionResult, 
          image: `data:image/jpeg;base64,${imageBase64}`,
          predicted_class: predictionResult.class,
          confidence: Math.round(predictionResult.confidence * 100)
        };
        
        setResult(analysisResult);
        console.log('Analysis complete:', analysisResult.predicted_class);
        
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'Failed to analyze image');
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [imageBase64, textInfo]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Unknown Priority';
    }
  };


  //✅ Updated upto here -- 1st upload -- Soumyajit -- 3.31 AM -- 09/08/25



  const renderRecommendationSection = (title: string, items: string[], icon: string) => (
    <View style={styles.recommendationSection}>
      <Text style={styles.sectionTitle}>
        {icon} {title}
      </Text>
      {items.map((item, index) => (
        <View key={index} style={styles.recommendationItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.recommendationText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const renderMedicalAdvice = (medicalAdvice: any) => (
    <View style={styles.recommendationSection}>
      <Text style={styles.sectionTitle}>
        🏥 Medical Advice
      </Text>
      
      <View style={styles.urgencyContainer}>
        <Text style={styles.urgencyLabel}>Priority Level:</Text>
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(medicalAdvice.urgency) }]}>
          <Text style={styles.urgencyText}>{getUrgencyText(medicalAdvice.urgency)}</Text>
        </View>
      </View>

      <View style={styles.medicalAdviceItem}>
        <Text style={styles.medicalAdviceLabel}>When to see a doctor:</Text>
        <Text style={styles.medicalAdviceText}>{medicalAdvice.when_to_see_doctor}</Text>
      </View>

      <Text style={styles.warningSignsTitle}>⚠️ Warning Signs to Watch For:</Text>
      {medicalAdvice.warning_signs.map((sign: string, index: number) => (
        <View key={index} style={styles.recommendationItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.recommendationText}>{sign}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Analyzing...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No result data found.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analysis Result</Text>
      
      {result.image && (
        <Image source={{ uri: result.image }} style={styles.image} resizeMode="cover" />
      )}
      
      <View style={styles.resultBox}>
        <Text style={styles.label}>Predicted Condition:</Text>
        <Text style={styles.value}>{result.predicted_class || result.class || 'Unknown'}</Text>
        
        <Text style={styles.label}>Confidence:</Text>
        <Text style={styles.value}>{result.confidence}%</Text>
        
        {result.recommendations && (
          <>
            <Text style={styles.label}>AI-Powered Recommendations:</Text>
            
            {!showDetailedRecommendations ? (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>{result.recommendations.general_advice}</Text>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => setShowDetailedRecommendations(true)}
                >
                  <Text style={styles.detailsButtonText}>View Detailed Recommendations</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.detailedRecommendations}>
                {renderRecommendationSection('🚨 Immediate Actions', result.recommendations.immediate_actions, '🚨')}
                {renderRecommendationSection('💡 Lifestyle Recommendations', result.recommendations.lifestyle_recommendations, '💡')}
                {renderRecommendationSection('💊 Treatment Suggestions', result.recommendations.treatment_suggestions, '💊')}
                {renderMedicalAdvice(result.recommendations.medical_advice)}
                {renderRecommendationSection('🛡️ Prevention Tips', result.recommendations.prevention_tips, '🛡️')}
                
                <View style={styles.disclaimerContainer}>
                  <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
                  <Text style={styles.disclaimerText}>{result.recommendations.disclaimer}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => setShowDetailedRecommendations(false)}
                >
                  <Text style={styles.detailsButtonText}>Show Summary</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Scan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e40af',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  resultBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 20,
    color: '#1d4ed8',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryContainer: {
    marginTop: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#059669',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  detailsButton: {
    marginTop: 16,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailedRecommendations: {
    marginTop: 12,
  },
  recommendationSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  medicalAdviceItem: {
    marginBottom: 12,
  },
  medicalAdviceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  medicalAdviceText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  warningSignsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 12,
    marginBottom: 8,
  },
  disclaimerContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    color: '#1e40af',
  },
});
