// API service for communicating with the backend
import { CONFIG } from './config';

export interface MedicalAdvice {
  when_to_see_doctor: string;
  urgency: string;
  warning_signs: string[];
}

export interface Recommendations {
  immediate_actions: string[];
  lifestyle_recommendations: string[];
  treatment_suggestions: string[];
  medical_advice: MedicalAdvice;
  prevention_tips: string[];
  general_advice: string;
  disclaimer: string;
}

export interface PredictionResponse {
  success: boolean;
  class: string;
  confidence: number;
  message: string;
  recommendations?: Recommendations;
  error?: string;
}

export const predictSkinCondition = async (imageBase64: string): Promise<PredictionResponse> => {
  let lastError: string | null = null;
  
  for (const baseUrl of CONFIG.BACKEND_URLS) {
    try {
      console.log(`Trying backend URL: ${baseUrl}${CONFIG.ENDPOINTS.PREDICT}`);
      
      const response = await fetch(`${baseUrl}${CONFIG.ENDPOINTS.PREDICT}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          image: imageBase64
        }),
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`HTTP Error ${response.status}: ${errorText}`);
        lastError = `HTTP ${response.status}: ${errorText}`;
        continue;
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log('Successfully received prediction:', data);
        return data;
      } else {
        lastError = data.error || 'Unknown server error';
        console.warn(`Backend responded with error:`, lastError);
      }
    } catch (e: any) {
      lastError = e.message || 'Network connection failed';
      console.warn(`Failed to connect to ${baseUrl}:`, lastError);
    }
  }
  
  // If we get here, all URLs failed
  throw new Error(`Could not connect to backend server. Last error: ${lastError}`);
};

export const checkBackendHealth = async (): Promise<boolean> => {
  for (const baseUrl of CONFIG.BACKEND_URLS) {
    try {
      console.log(`Checking backend health at: ${baseUrl}${CONFIG.ENDPOINTS.PING}`);
      const response = await fetch(`${baseUrl}${CONFIG.ENDPOINTS.PING}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`Health check response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Backend is healthy at: ${baseUrl}`, data);
        return true;
      } else {
        console.warn(`Backend health check failed for ${baseUrl}: HTTP ${response.status}`);
      }
    } catch (e) {
      console.warn(`Backend health check failed for ${baseUrl}:`, e);
    }
  }
  return false;
}; 