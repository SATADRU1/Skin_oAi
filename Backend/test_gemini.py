#!/usr/bin/env python3
"""
Test script for Gemini AI integration

This script demonstrates how the Gemini service works with different skin conditions
and confidence levels. It shows the fallback recommendations when no API key is provided.

Usage:
    python test_gemini.py
"""

import json
from gemini_service import gemini_service

def test_recommendations():
    """Test the recommendation system with different scenarios"""
    
    print("🧪 Testing Gemini AI Integration for SkinOAI")
    print("=" * 50)
    
    # Test cases with different conditions and confidence levels
    test_cases = [
        {
            "condition": "acne",
            "confidence": 0.85,
            "description": "High confidence acne detection"
        },
        {
            "condition": "melanoma",
            "confidence": 0.92,
            "description": "High confidence melanoma detection (urgent)"
        },
        {
            "condition": "eczema",
            "confidence": 0.65,
            "description": "Moderate confidence eczema detection"
        },
        {
            "condition": "psoriasis",
            "confidence": 0.45,
            "description": "Low confidence psoriasis detection"
        },
        {
            "condition": "unknown_condition",
            "confidence": 0.25,
            "description": "Very low confidence unknown condition"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 Test Case {i}: {test_case['description']}")
        print(f"   Condition: {test_case['condition']}")
        print(f"   Confidence: {test_case['confidence']:.2f}")
        print("-" * 40)
        
        try:
            # Generate recommendations
            recommendations = gemini_service.generate_recommendations(
                test_case['condition'], 
                test_case['confidence']
            )
            
            # Display key recommendations
            print("🚨 Immediate Actions:")
            for action in recommendations['immediate_actions'][:3]:
                print(f"   • {action}")
            
            print("\n💊 Treatment Suggestions:")
            for treatment in recommendations['treatment_suggestions'][:3]:
                print(f"   • {treatment}")
            
            print(f"\n🏥 Medical Advice:")
            print(f"   • Urgency: {recommendations['medical_advice']['urgency']}")
            print(f"   • When to see doctor: {recommendations['medical_advice']['when_to_see_doctor']}")
            
            print(f"\n⚠️  Disclaimer: {recommendations['disclaimer']}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("✅ Test completed!")
    print("\n📝 Note: This test uses fallback recommendations since no API key is configured.")
    print("   To get AI-powered recommendations, add your Gemini API key to the .env file.")

def test_service_health():
    """Test the service health status"""
    print("\n🔍 Service Health Check:")
    health = gemini_service.get_health_status()
    print(json.dumps(health, indent=2))

if __name__ == "__main__":
    test_service_health()
    test_recommendations() 