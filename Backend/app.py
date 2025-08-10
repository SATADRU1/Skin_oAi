from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import tempfile
import os
from roboflow import Roboflow
from gemini_service import gemini_service

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Roboflow connection
rf = Roboflow(api_key=".............................")
project = rf.workspace().project("my-first-project-apmvj")

def get_model():
    """Get the Roboflow model instance"""
    try:
        return project.version(1).model
    except Exception as e:
        print(f"Error getting model: {e}")
        return None

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

@app.route('/predict', methods=['POST'])
def predict_route():
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON', 'success': False}), 400
        
        data = request.get_json()
        
        # Validate required fields
        if not data or 'image' not in data:
            return jsonify({'error': 'Missing image data', 'success': False}), 400
        
        # Decode the image from base64
        try:
            img_data = base64.b64decode(data['image'])
            image = Image.open(io.BytesIO(img_data)).convert("RGB")
        except Exception as e:
            return jsonify({'error': 'Invalid image data', 'success': False}), 400
        
        # Save image temporarily for Roboflow prediction
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, 'temp_prediction.jpg')
        
        # Save the image
        image.save(temp_path)
        
        # Get model and prediction from Roboflow
        model = get_model()
        if not model:
            return jsonify({
                'success': False,
                'error': 'Failed to initialize model',
                'class': 'Unknown',
                'confidence': 0.0
            }), 500
        
        result = model.predict(temp_path).json()
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        # Process the result
        if result.get('predictions') and len(result['predictions']) > 0:
            prediction = result['predictions'][0]
            if prediction.get('predictions') and len(prediction['predictions']) > 0:
                pred = prediction['predictions'][0]
                class_name = pred.get('class', 'Unknown')
                confidence = float(pred.get('confidence', 0.0))
                
                # Generate AI-powered recommendations
                try:
                    recommendations = gemini_service.generate_recommendations(class_name, confidence)
                except Exception as e:
                    print(f"Error generating recommendations: {e}")
                    recommendations = {
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
                
                return jsonify({
                    'success': True,
                    'class': class_name,
                    'confidence': confidence,
                    'message': 'Prediction successful',
                    'recommendations': recommendations
                })
        
        return jsonify({
            'success': False,
            'error': 'No prediction results',
            'class': 'Unknown',
            'confidence': 0.0
        }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
