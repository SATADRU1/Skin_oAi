import requests
import base64

def test_prediction():
    """Test the prediction endpoint with a sample image"""
    
    # Load the test image
    try:
        with open("img1.jpg", "rb") as image_file:
            # Convert to base64
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print("Test image img1.jpg not found")
        return
