from roboflow import Roboflow

def load_model():
    """Load and return the Roboflow model"""
    try:
        rf = Roboflow(api_key="L31Uphzcnzk9K1lubds3")
        project = rf.workspace().project("soumya-1kwss")
        return project.version(1).model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def predict_image(model, image_path):
    """Make prediction on a single image"""
    try:
        result = model.predict(image_path).json()
        if result.get('predictions') and len(result['predictions']) > 0:
            prediction = result['predictions'][0].get('predictions', [{}])[0]
            return {
                'class': prediction.get('class', 'Unknown'),
                'confidence': float(prediction.get('confidence', 0.0))
            }
        return {'error': 'No predictions found'}
    except Exception as e:
        return {'error': str(e)}
