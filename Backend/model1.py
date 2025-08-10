from roboflow import Roboflow

rf = Roboflow(api_key="rf_5sGiHcW9RVSuffJwbDu1KlYSFPg1")
project = rf.workspace().project("soumya-1kwss")
model = project.version(1).model
result = model.predict("img1.jpg").json()
confidence=result['predictions'][0]['predictions'][0]['confidence']
class_=result['predictions'][0]['predictions'][0]['class']
print(class_,confidence)
