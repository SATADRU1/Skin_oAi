from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import tempfile
import os
import threading
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError
from model1 import optimized_model
from gemini_service import gemini_service
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Thread pool for handling concurrent requests
thread_pool = ThreadPoolExecutor(max_workers=4)

# Request timeout settings
PREDICTION_TIMEOUT = 20  # seconds
GEMINI_TIMEOUT = 10      # seconds

@app.route('/')
def home():
    return jsonify({'message': 'SkinOAI API is running!', 'status': 'healthy'})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'})

@app.route('/health', methods=['GET'])
def health():
    """Check the health status of all services"""
    gemini_status = gemini_service.get_health_status()
    return jsonify({
        'status': 'healthy',
        'services': {
            'roboflow': 'healthy',
            'gemini': gemini_status
        },
        'message': 'All services are operational'
    })

def optimize_image_for_api(img_data, max_size=512):
    """Optimize image from base64 data for faster API processing"""
    try:
        image = Image.open(io.BytesIO(img_data)).convert("RGB")
        
        # Resize if too large
        width, height = image.size
        if max(width, height) > max_size:
            ratio = max_size / max(width, height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
        return image
    except Exception as e:
        logger.error(f"Error optimizing image: {e}")
        raise e

def run_prediction_with_timeout(image_path):
    """Run prediction with timeout in separate thread"""
    try:
        return optimized_model.predict_with_timeout(image_path, timeout=PREDICTION_TIMEOUT)
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {
            'success': False,
            'error': str(e),
            'class': 'Unknown',
            'confidence': 0.0
        }

def run_gemini_with_timeout(class_name, confidence):
    """Run Gemini recommendations with timeout"""
    try:
        return gemini_service.generate_recommendations(class_name, confidence)
    except Exception as e:
        logger.error(f"Gemini error: {e}")
        return {
            "immediate_actions": ["Consult a healthcare professional for proper diagnosis"],
            "lifestyle_recommendations": ["Maintain good skin hygiene"],
            "treatment_suggestions": ["Seek medical advice"],
            "medical_advice": {
                "when_to_see_doctor": "As soon as possible",
                "urgency": "medium",
                "warning_signs": ["Any concerning symptoms"]
            },
            "prevention_tips": ["Regular skin checks"],
            "general_advice": "Please consult a healthcare provider",
            "disclaimer": "This is AI-generated advice and should not replace professional medical consultation."
        }

@app.route('/predict', methods=['POST'])
def predict_route():
    start_time = time.time()
    temp_path = None
    
    try:
        logger.info("Starting prediction request")
        
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON', 'success': False}), 400
        
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'Missing image data', 'success': False}), 400
        
        # Decode and optimize image
        try:
            img_data = base64.b64decode(data['image'])
            logger.info(f"Image data size: {len(img_data)} bytes")
            
            image = optimize_image_for_api(img_data)
            logger.info(f"Optimized image size: {image.size}")
            
        except Exception as e:
            logger.error(f"Image processing error: {e}")
            return jsonify({'error': 'Invalid image data', 'success': False}), 400
        
        # Save optimized image temporarily
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f'pred_{int(time.time()*1000)}.jpg')
        image.save(temp_path, 'JPEG', quality=85, optimize=True)
        
        # Check if model is available
        if not optimized_model.initialized:
            return jsonify({
                'success': False,
                'error': 'AI model not available',
                'class': 'Unknown',
                'confidence': 0.0
            }), 503
        
        # Run prediction with timeout
        logger.info("Starting prediction...")
        try:
            future = thread_pool.submit(run_prediction_with_timeout, temp_path)
            prediction_result = future.result(timeout=PREDICTION_TIMEOUT)
        except TimeoutError:
            logger.error("Prediction timeout")
            return jsonify({
                'success': False,
                'error': 'Prediction timeout - please try again',
                'class': 'Unknown',
                'confidence': 0.0
            }), 408
        
        # Check prediction result
        if not prediction_result.get('success', False):
            return jsonify({
                'success': False,
                'error': prediction_result.get('error', 'Prediction failed'),
                'class': 'Unknown',
                'confidence': 0.0
            }), 500
        
        class_name = prediction_result['class']
        confidence = prediction_result['confidence']
        
        logger.info(f"Prediction successful: {class_name} ({confidence*100:.1f}%)")
        
        # Generate recommendations in parallel (non-blocking)
        recommendations = None
        try:
            future_gemini = thread_pool.submit(run_gemini_with_timeout, class_name, confidence)
            recommendations = future_gemini.result(timeout=GEMINI_TIMEOUT)
        except TimeoutError:
            logger.warning("Gemini timeout, using fallback recommendations")
            recommendations = run_gemini_with_timeout(class_name, confidence)  # This will return fallback
        except Exception as e:
            logger.warning(f"Gemini error, using fallback: {e}")
            recommendations = run_gemini_with_timeout(class_name, confidence)
        
        total_time = time.time() - start_time
        logger.info(f"Total prediction time: {total_time:.2f} seconds")
        
        return jsonify({
            'success': True,
            'class': class_name,
            'confidence': confidence,
            'message': 'Prediction successful',
            'recommendations': recommendations,
            'processing_time': round(total_time, 2)
        })
        
    except Exception as e:
        total_time = time.time() - start_time
        logger.error(f"Unexpected error after {total_time:.2f}s: {e}")
        return jsonify({
            'success': False,
            'error': 'Server error - please try again',
            'details': str(e) if app.debug else None
        }), 500
        
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.debug(f"Cleaned up temp file: {temp_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up temp file: {e}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
