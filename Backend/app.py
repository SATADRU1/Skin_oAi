from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import tempfile
import os
from roboflow import Roboflow

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Roboflow connection
rf = Roboflow(api_key="K3NtQYY2EhfGyAd78fvK")
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

@app.route('/predict', methods=['POST'])
def predict_route():
