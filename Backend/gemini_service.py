"""
Gemini AI Service for Skin Condition Recommendations

This module provides intelligent recommendations for skin conditions using Google's Gemini AI.
It analyzes the predicted skin condition and confidence level to provide personalized
recommendations including lifestyle changes, treatment options, and when to seek medical help.

Author: SkinOAI Team
Date: 2025
"""

import os
import google.generativeai as genai
from typing import Dict, List, Optional, Tuple
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiRecommendationService:
    """
    Service class for generating AI-powered skin condition recommendations using Gemini.
    
    This service provides intelligent, personalized recommendations based on:
    - Predicted skin condition
    - Confidence level of the prediction
    - General best practices for skin health
    
    Attributes:
        model: The Gemini model instance
        is_initialized: Whether the service has been properly initialized
    """
    
    def __init__(self):
        """Initialize the Gemini service with API key and model configuration."""
        self.model = None
        self.is_initialized = False
        self._initialize_gemini()
    
    def _initialize_gemini(self) -> None:
        """
        Initialize the Gemini AI model with proper configuration.
        
        This method:
        1. Loads the API key from environment variables
        2. Configures the Gemini model
        3. Sets up safety settings for medical advice
        4. Handles initialization errors gracefully
        """
        try:
            # Use the provided API key directly
            api_key = "AIzaSyDLGxa4DaIODe920y3euj4jeh2SieDsjow"
            if not api_key:
                logger.error("GEMINI_API_KEY not found")
                self.is_initialized = False
                return
            
            # Configure Gemini
            genai.configure(api_key=api_key)
            
            # Initialize the model with safety settings
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
            
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            self.is_initialized = True
            logger.info("Gemini service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {str(e)}")
            self.is_initialized = False
    
    def _get_confidence_level_description(self, confidence: float) -> str:
        """
        Convert confidence score to human-readable description.
        
        Args:
            confidence: Confidence score between 0.0 and 1.0
            
        Returns:
            String description of confidence level
        """
        if confidence >= 0.9:
            return "very high confidence"
        elif confidence >= 0.7:
            return "high confidence"
        elif confidence >= 0.5:
            return "moderate confidence"
        elif confidence >= 0.3:
            return "low confidence"
        else:
            return "very low confidence"
    
    def _get_urgency_level(self, condition: str, confidence: float) -> str:
        """
        Determine urgency level based on condition and confidence.
        
        Args:
            condition: Predicted skin condition
            confidence: Confidence score
            
        Returns:
            Urgency level string
        """
        # High-urgency conditions that require immediate attention
        urgent_conditions = [
            'melanoma', 'skin cancer', 'severe infection', 'cellulitis',
            'necrotizing fasciitis', 'severe allergic reaction'
        ]
        
        # Medium-urgency conditions
        medium_conditions = [
            'psoriasis', 'eczema', 'dermatitis', 'acne', 'rosacea',
            'fungal infection', 'bacterial infection'
        ]
        
        condition_lower = condition.lower()
        
        if any(urgent in condition_lower for urgent in urgent_conditions):
            return "high" if confidence > 0.5 else "medium"
        elif any(medium in condition_lower for medium in medium_conditions):
            return "medium" if confidence > 0.3 else "low"
        else:
            return "low"
    
    def generate_recommendations(self, condition: str, confidence: float) -> Dict:
        """
        Generate comprehensive recommendations for a skin condition.
        
        This method creates personalized recommendations including:
        - Immediate actions to take
        - Lifestyle recommendations
        - Treatment suggestions
        - When to seek medical help
        - Prevention tips
        
        Args:
            condition: The predicted skin condition
            confidence: Confidence score between 0.0 and 1.0
            
        Returns:
            Dictionary containing structured recommendations
            
        Note:
            If Gemini service is not initialized, returns fallback recommendations
        """
        if not self.is_initialized or not self.model:
            logger.warning("Gemini service not initialized, using fallback recommendations")
            urgency_level = self._get_urgency_level(condition, confidence)
            return self._get_fallback_recommendations(condition, confidence, urgency_level)
        
        try:
            confidence_desc = self._get_confidence_level_description(confidence)
            urgency_level = self._get_urgency_level(condition, confidence)
            
            # Create the prompt for Gemini
            prompt = f"""
            You are a dermatological AI assistant providing recommendations for skin conditions.
            
            CONDITION: {condition}
            CONFIDENCE: {confidence_desc} ({confidence:.2f})
            URGENCY LEVEL: {urgency_level}
            
            Please provide comprehensive recommendations in the following JSON format:
            {{
                "immediate_actions": [
                    "List 3-5 immediate actions the person should take"
                ],
                "lifestyle_recommendations": [
                    "List 3-5 lifestyle changes that could help"
                ],
                "treatment_suggestions": [
                    "List 3-5 treatment options (over-the-counter and prescription)"
                ],
                "medical_advice": {{
                    "when_to_see_doctor": "When should they seek medical attention?",
                    "urgency": "{urgency_level}",
                    "warning_signs": [
                        "List 3-5 warning signs to watch for"
                    ]
                }},
                "prevention_tips": [
                    "List 3-5 prevention tips for the future"
                ],
                "general_advice": "Brief general advice about this condition",
                "disclaimer": "Important medical disclaimer about AI recommendations"
            }}
            
            IMPORTANT GUIDELINES:
            1. Always prioritize safety and recommend medical consultation when appropriate
            2. Be specific but not overly technical
            3. Include both immediate and long-term recommendations
            4. Consider the confidence level - lower confidence means more cautious advice
            5. Always include a medical disclaimer
            6. Return ONLY valid JSON, no additional text
            """
            
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            
            # Parse the response (assuming it returns valid JSON)
            import json
            try:
                recommendations = json.loads(response.text)
                return recommendations
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                logger.warning("Failed to parse Gemini response as JSON, using fallback")
                return self._get_fallback_recommendations(condition, confidence, urgency_level)
                
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return self._get_fallback_recommendations(condition, confidence, urgency_level)
    
    def _get_fallback_recommendations(self, condition: str, confidence: float, urgency: str) -> Dict:
        """
        Provide fallback recommendations when Gemini API fails.
        
        Args:
            condition: The predicted skin condition
            confidence: Confidence score
            urgency: Urgency level
            
        Returns:
            Dictionary with basic fallback recommendations
        """
        return {
            "immediate_actions": [
                "Keep the affected area clean and dry",
                "Avoid scratching or irritating the area",
                "Apply a gentle moisturizer if the skin is dry"
            ],
            "lifestyle_recommendations": [
                "Maintain good hygiene practices",
                "Avoid known allergens or irritants",
                "Use gentle, fragrance-free skincare products"
            ],
            "treatment_suggestions": [
                "Consider over-the-counter hydrocortisone cream for mild cases",
                "Use gentle cleansers and moisturizers",
                "Consult a dermatologist for proper diagnosis and treatment"
            ],
            "medical_advice": {
                "when_to_see_doctor": "If symptoms persist for more than 2 weeks or worsen",
                "urgency": urgency,
                "warning_signs": [
                    "Severe pain or discomfort",
                    "Signs of infection (redness, warmth, pus)",
                    "Rapid spreading of the condition"
                ]
            },
            "prevention_tips": [
                "Protect your skin from excessive sun exposure",
                "Maintain a healthy diet and lifestyle",
                "Regular skin checks and early detection"
            ],
            "general_advice": f"Based on the AI prediction of {condition} with {confidence:.1%} confidence, it's important to monitor the condition and seek professional medical advice if needed.",
            "disclaimer": "This is AI-generated advice and should not replace professional medical consultation. Always consult with a qualified healthcare provider for proper diagnosis and treatment."
        }
    
    def get_health_status(self) -> Dict:
        """
        Check the health status of the Gemini service.
        
        Returns:
            Dictionary with service status information
        """
        return {
            "service": "gemini_recommendations",
            "status": "healthy" if self.is_initialized else "unhealthy",
            "initialized": self.is_initialized,
            "model_available": self.model is not None
        }

# Global instance of the service
gemini_service = GeminiRecommendationService() 