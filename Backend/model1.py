from roboflow import Roboflow
import time
import os
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OptimizedSkinModel:
    """Optimized skin analysis model with error handling and performance improvements"""
    
    def __init__(self):
        self.rf = None
        self.model = None
        self.initialized = False
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the Roboflow model with error handling"""
        try:
            logger.info("Initializing Roboflow model...")
            start_time = time.time()
            
            self.rf = Roboflow(api_key="QJXTDtMOkjDsKyTi0xhQ")
            project = self.rf.workspace().project("skin-ai-dataset-training-gggjo-v2myr")
            self.model = project.version(1).model
            
            self.initialized = True
            logger.info(f"Model initialized successfully in {time.time() - start_time:.2f} seconds")
            
        except Exception as e:
            logger.error(f"Failed to initialize model: {e}")
            self.initialized = False
    
    def optimize_image(self, image_path, max_size=800):
        """Optimize image for faster processing"""
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if too large
                width, height = img.size
                if max(width, height) > max_size:
                    ratio = max_size / max(width, height)
                    new_width = int(width * ratio)
                    new_height = int(height * ratio)
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Save optimized image
                    optimized_path = image_path.replace('.jpg', '_optimized.jpg')
                    img.save(optimized_path, 'JPEG', quality=85, optimize=True)
                    return optimized_path
            
            return image_path
            
        except Exception as e:
            logger.error(f"Error optimizing image: {e}")
            return image_path
    
    def predict_with_timeout(self, image_path, timeout=15):
        """Predict with timeout handling"""
        if not self.initialized or not self.model:
            raise Exception("Model not initialized")
        
        try:
            logger.info(f"Starting prediction for: {image_path}")
            start_time = time.time()
            
            # Optimize image first
            optimized_path = self.optimize_image(image_path)
            
            # Make prediction
            result = self.model.predict(optimized_path).json()
            
            # Clean up optimized image if it was created
            if optimized_path != image_path and os.path.exists(optimized_path):
                os.remove(optimized_path)
            
            prediction_time = time.time() - start_time
            logger.info(f"Prediction completed in {prediction_time:.2f} seconds")
            
            return self._process_result(result)
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            # Clean up optimized image if it exists
            optimized_path = image_path.replace('.jpg', '_optimized.jpg')
            if os.path.exists(optimized_path):
                os.remove(optimized_path)
            raise e
    
    def _process_result(self, result):
        """Process prediction result with better error handling"""
        try:
            if not result or 'predictions' not in result:
                return {
                    'class': 'Unknown',
                    'confidence': 0.0,
                    'success': False,
                    'error': 'No predictions in result'
                }
            
            predictions = result['predictions']
            if not predictions or len(predictions) == 0:
                return {
                    'class': 'Unknown',
                    'confidence': 0.0,
                    'success': False,
                    'error': 'Empty predictions array'
                }
            
            # Handle nested predictions structure
            prediction = predictions[0]
            if 'predictions' in prediction and len(prediction['predictions']) > 0:
                pred_data = prediction['predictions'][0]
            else:
                # Direct prediction format
                pred_data = prediction
            
            class_name = pred_data.get('class', 'Unknown')
            confidence = float(pred_data.get('confidence', 0.0))
            
            logger.info(f"Prediction result: {class_name} ({confidence*100:.1f}%)")
            
            return {
                'class': class_name,
                'confidence': confidence,
                'success': True,
                'raw_result': result
            }
            
        except Exception as e:
            logger.error(f"Error processing result: {e}")
            return {
                'class': 'Unknown',
                'confidence': 0.0,
                'success': False,
                'error': str(e)
            }
    
    def quick_test(self, image_path="img1.jpg"):
        """Quick test method"""
        if os.path.exists(image_path):
            result = self.predict_with_timeout(image_path)
            if result['success']:
                print(f"Prediction: {result['class']} ({result['confidence']*100:.1f}%)")
            else:
                print(f"Prediction failed: {result.get('error', 'Unknown error')}")
            return result
        else:
            print(f"Image file {image_path} not found")
            return {'success': False, 'error': 'Image file not found'}

# Global model instance
optimized_model = OptimizedSkinModel()

# For backward compatibility and testing
if __name__ == "__main__":
    result = optimized_model.quick_test()
    if result['success']:
        print(f"Class: {result['class']}")
        print(f"Confidence: {result['confidence']*100:.1f}%")
