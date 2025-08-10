#!/usr/bin/env python3
"""
Quick test script for the optimized SkinOAI backend
"""

import time
import base64
import requests
import json
from PIL import Image
import io
import os

def create_test_image():
    """Create a simple test image for testing"""
    # Create a simple colored image for testing
    img = Image.new('RGB', (300, 300), color='lightblue')
    
    # Save as bytes
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG', quality=85)
    img_byte_arr = img_byte_arr.getvalue()
    
    # Convert to base64
    img_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
    return img_base64

def test_backend_connection(url="http://localhost:5000"):
    """Test if backend is running"""
    try:
        response = requests.get(f"{url}/ping", timeout=5)
        if response.status_code == 200:
            print(f"✅ Backend is running at {url}")
            return True
        else:
            print(f"❌ Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend at {url}: {e}")
        return False

def test_prediction_api(url="http://localhost:5000"):
    """Test the prediction API endpoint"""
    print("\n🔄 Testing prediction API...")
    
    # Create test image
    test_image_b64 = create_test_image()
    
    # Prepare request
    payload = {
        "image": test_image_b64
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{url}/predict", 
            json=payload, 
            headers=headers, 
            timeout=30
        )
        
        response_time = time.time() - start_time
        
        print(f"⏱️  Response time: {response_time:.2f} seconds")
        print(f"📊 Status code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print(f"✅ Prediction successful!")
                print(f"🏷️  Class: {result.get('class', 'Unknown')}")
                print(f"🎯 Confidence: {result.get('confidence', 0)*100:.1f}%")
                print(f"📝 Message: {result.get('message', 'No message')}")
                
                # Check if recommendations are included
                if 'recommendations' in result:
                    print("✅ Recommendations included")
                else:
                    print("⚠️  No recommendations in response")
                
                return True
                
            except json.JSONDecodeError:
                print("❌ Invalid JSON response")
                print(f"Raw response: {response.text[:500]}")
                return False
        else:
            print(f"❌ API error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out (>30 seconds)")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

def test_with_real_image(image_path, url="http://localhost:5000"):
    """Test with a real image file if available"""
    if not os.path.exists(image_path):
        print(f"ℹ️  No real image found at {image_path}, skipping real image test")
        return True
    
    print(f"\n🖼️  Testing with real image: {image_path}")
    
    try:
        with open(image_path, 'rb') as f:
            img_data = f.read()
            img_base64 = base64.b64encode(img_data).decode('utf-8')
        
        print(f"📏 Image size: {len(img_data)} bytes")
        
        payload = {"image": img_base64}
        headers = {"Content-Type": "application/json"}
        
        start_time = time.time()
        response = requests.post(f"{url}/predict", json=payload, headers=headers, timeout=45)
        response_time = time.time() - start_time
        
        print(f"⏱️  Response time: {response_time:.2f} seconds")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Real image prediction successful!")
            print(f"🏷️  Class: {result.get('class', 'Unknown')}")
            print(f"🎯 Confidence: {result.get('confidence', 0)*100:.1f}%")
            return True
        else:
            print(f"❌ Real image prediction failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing with real image: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 SkinOAI Backend Quick Test")
    print("=" * 40)
    
    # Test backend URLs
    backend_urls = [
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ]
    
    working_url = None
    
    # Find a working backend
    for url in backend_urls:
        if test_backend_connection(url):
            working_url = url
            break
    
    if not working_url:
        print("\n❌ No working backend found!")
        print("Please make sure the backend is running:")
        print("   python app.py")
        print("   # or")
        print("   python start_optimized.py")
        return False
    
    print(f"\n🎯 Using backend: {working_url}")
    
    # Test prediction API
    api_test = test_prediction_api(working_url)
    
    # Test with real images if available
    test_images = ['img1.jpg', 'test.jpg', 'sample.jpg']
    for img in test_images:
        if os.path.exists(img):
            test_with_real_image(img, working_url)
            break
    
    print("\n" + "=" * 40)
    
    if api_test:
        print("🎉 All tests passed! Your optimized backend is working!")
        print("\n📱 You can now use the frontend app to scan images")
        print("⚡ Expected response time: 5-15 seconds per scan")
    else:
        print("❌ Some tests failed. Check the output above for details.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
