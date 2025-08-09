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
