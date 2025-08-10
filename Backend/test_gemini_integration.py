#!/usr/bin/env python3
"""
Test script for Gemini AI integration

This script tests the Gemini recommendation service with sample skin conditions
to verify the integration is working properly.

Usage:
    python test_gemini_integration.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from gemini_service import gemini_service

def test_gemini_service():
    """Test the Gemini service with various skin conditions"""
    
    print("🧪 Testing Gemini AI Integration")
    print("=" * 50)
    
    # Test 1: Check service initialization
    print("\n1. Testing service initialization...")
    health_status = gemini_service.get_health_status()
    print(f"   Service Status: {health_status['status']}")
    print(f"   Initialized: {health_status['initialized']}")
    print(f"   Model Available: {health_status['model_available']}")
    
    if not health_status['initialized']:
        print("   ❌ Service not initialized. Check your API key.")
        return False
    
    print("   ✅ Service initialized successfully!")
    
    # Test 2: Test with different skin conditions
    test_cases = [
        ("acne", 0.85),
        ("eczema", 0.72),
        ("psoriasis", 0.91),
        ("healthy skin", 0.95),
        ("melanoma", 0.78)
    ]
    
    print("\n2. Testing recommendations generation...")
    
    for condition, confidence in test_cases:
        print(f"\n   Testing: {condition} (confidence: {confidence:.2f})")
        
        try:
            recommendations = gemini_service.generate_recommendations(condition, confidence)
            
            # Check if we got the expected structure
            required_keys = [
                'immediate_actions', 'lifestyle_recommendations', 
                'treatment_suggestions', 'medical_advice', 
                'prevention_tips', 'general_advice', 'disclaimer'
            ]
            
            missing_keys = [key for key in required_keys if key not in recommendations]
            
            if missing_keys:
                print(f"   ❌ Missing keys: {missing_keys}")
                continue
            
            # Check medical advice structure
            medical_keys = ['when_to_see_doctor', 'urgency', 'warning_signs']
            medical_missing = [key for key in medical_keys if key not in recommendations['medical_advice']]
            
            if medical_missing:
                print(f"   ❌ Missing medical advice keys: {medical_missing}")
                continue
            
            print(f"   ✅ Generated recommendations successfully")
            print(f"   📋 Urgency: {recommendations['medical_advice']['urgency']}")
            print(f"   💡 Actions: {len(recommendations['immediate_actions'])} items")
            print(f"   🏥 Medical advice: {recommendations['medical_advice']['when_to_see_doctor'][:50]}...")
            
        except Exception as e:
            print(f"   ❌ Error generating recommendations: {str(e)}")
            continue
    
    # Test 3: Test fallback recommendations
    print("\n3. Testing fallback recommendations...")
    
    # Temporarily disable the model to test fallback
    original_model = gemini_service.model
    gemini_service.model = None
    
    try:
        fallback_recs = gemini_service.generate_recommendations("test condition", 0.5)
        print("   ✅ Fallback recommendations working")
        print(f"   📋 Fallback urgency: {fallback_recs['medical_advice']['urgency']}")
    except Exception as e:
        print(f"   ❌ Fallback recommendations failed: {str(e)}")
    
    # Restore the model
    gemini_service.model = original_model
    
    print("\n" + "=" * 50)
    print("🎉 Gemini integration test completed!")
    
    return True

def test_api_endpoint():
    """Test the API endpoint if the server is running"""
    import requests
    import json
    
    print("\n🌐 Testing API endpoint...")
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print("   ✅ Health endpoint working")
            print(f"   📊 Gemini status: {health_data.get('services', {}).get('gemini', {}).get('status', 'unknown')}")
        else:
            print(f"   ❌ Health endpoint returned {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ⚠️  Server not running. Start with: python app.py")
        return False
    except Exception as e:
        print(f"   ❌ API test failed: {str(e)}")
        return False
    
    # Test prediction endpoint with sample data
    print("\n   Testing prediction endpoint...")
    
    try:
        # Create a simple test image (1x1 pixel)
        import base64
        from PIL import Image
        import io
        
        # Create a minimal test image
        img = Image.new('RGB', (1, 1), color='red')
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='JPEG')
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        
        response = requests.post(
            "http://localhost:5000/predict",
            json={"image": img_base64},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('recommendations'):
                print("   ✅ Prediction endpoint working with recommendations")
                print(f"   📋 Condition: {data.get('class', 'unknown')}")
                print(f"   📊 Confidence: {data.get('confidence', 0):.2f}")
                print(f"   💡 Has recommendations: {'recommendations' in data}")
            else:
                print("   ⚠️  Prediction worked but no recommendations")
        else:
            print(f"   ❌ Prediction endpoint returned {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Prediction test failed: {str(e)}")
    
    return True

if __name__ == "__main__":
    print("🚀 Starting Gemini Integration Tests")
    print("Make sure you have set up your GEMINI_API_KEY in the .env file")
    print()
    
    # Check if API key is set
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or api_key == 'your_gemini_api_key_here':
        print("❌ GEMINI_API_KEY not found or not set properly")
        print("Please create a .env file with your actual Gemini API key")
        sys.exit(1)
    
    # Run tests
    service_test = test_gemini_service()
    api_test = test_api_endpoint()
    
    if service_test and api_test:
        print("\n🎉 All tests passed! Gemini integration is working properly.")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        sys.exit(1) 