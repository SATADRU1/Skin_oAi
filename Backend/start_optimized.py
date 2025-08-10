#!/usr/bin/env python3
"""
Optimized SkinOAI Backend Startup Script
This script helps test and run the optimized backend with proper error handling
"""

import sys
import time
import logging
from model1 import optimized_model
from gemini_service import gemini_service

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_model_initialization():
    """Test if the model initializes properly"""
    logger.info("🔄 Testing model initialization...")
    
    if optimized_model.initialized:
        logger.info("✅ Model initialized successfully!")
        return True
    else:
        logger.error("❌ Model failed to initialize")
        return False

def test_gemini_service():
    """Test Gemini service"""
    logger.info("🔄 Testing Gemini service...")
    
    status = gemini_service.get_health_status()
    if status.get('initialized', False):
        logger.info("✅ Gemini service is ready!")
        return True
    else:
        logger.warning("⚠️  Gemini service not available (will use fallback)")
        return False

def run_quick_prediction_test():
    """Run a quick prediction test if test image exists"""
    import os
    
    test_images = ['img1.jpg', 'test.jpg', 'sample.jpg']
    
    for img_name in test_images:
        if os.path.exists(img_name):
            logger.info(f"🔄 Testing prediction with {img_name}...")
            try:
                result = optimized_model.quick_test(img_name)
                if result.get('success', False):
                    logger.info(f"✅ Test prediction successful: {result['class']} ({result['confidence']*100:.1f}%)")
                    return True
                else:
                    logger.error(f"❌ Test prediction failed: {result.get('error', 'Unknown error')}")
            except Exception as e:
                logger.error(f"❌ Test prediction error: {e}")
            break
    else:
        logger.info("ℹ️  No test images found, skipping prediction test")
    
    return False

def main():
    """Main startup function"""
    logger.info("🚀 Starting SkinOAI Optimized Backend")
    logger.info("=" * 50)
    
    # Test model
    model_ok = test_model_initialization()
    
    # Test Gemini
    gemini_ok = test_gemini_service()
    
    # Quick prediction test
    if model_ok:
        run_quick_prediction_test()
    
    logger.info("=" * 50)
    
    if model_ok:
        logger.info("✅ Backend is ready to start!")
        logger.info("📚 To start the server, run: python app.py")
        logger.info("🌐 Server will be available at: http://localhost:5000")
        
        # Start the Flask app
        try:
            logger.info("🚀 Starting Flask application...")
            from app import app
            app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
        except KeyboardInterrupt:
            logger.info("⏹️  Server stopped by user")
        except Exception as e:
            logger.error(f"❌ Server error: {e}")
    else:
        logger.error("❌ Backend not ready - please check the errors above")
        sys.exit(1)

if __name__ == "__main__":
    main()
