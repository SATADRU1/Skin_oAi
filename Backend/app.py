from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import tempfile
import os
from model_utils import load_model, predict_image

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the model when the app starts
model = load_model()
if not model:
    print("Failed to load model. The application may not work correctly.")
      
@app.route('/')
def home():
    return jsonify({'message': 'SkinOAI API is running!', 'status': 'healthy'})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'})

@app.route('/predict', methods=['POST'])
def predict_route():
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON', 'success': False}), 400

        # Get JSON data
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

        # Save image temporarily for prediction
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, 'temp_prediction.jpg')
        image.save(temp_path)
        
        # Check if model is loaded
        if not model:
            return jsonify({
                'success': False,
                'error': 'Model not loaded',
                'class': 'Unknown',
                'confidence': 0.0
            }), 500

        # Get prediction
        prediction = predict_image(model, temp_path)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        # Handle prediction result
        if 'error' in prediction:
            return jsonify({
                'success': False,
                'error': prediction['error'],
                'class': 'Unknown',
                'confidence': 0.0
            }), 500
            
        return jsonify({
            'success': True,
            'class': prediction['class'],
            'confidence': prediction['confidence'],
            'message': 'Prediction successful'
        })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

