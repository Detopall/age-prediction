from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from transformers import AutoFeatureExtractor, AutoModelForImageClassification

app = Flask(__name__)
CORS(app)

transforms = AutoFeatureExtractor.from_pretrained("nateraw/vit-age-classifier")
hugging_model = AutoModelForImageClassification.from_pretrained("nateraw/vit-age-classifier")

@app.route('/prediction', methods=['POST'])
def predict():
    image_file = request.files['image']
    return preprocess_image(image_file)

def preprocess_image(image):
	img = Image.open(image)

	inputs = transforms(img, return_tensors='pt')
	output = hugging_model(**inputs)
	proba = output.logits.softmax(1)
	
	return create_probabilities(proba)


def create_probabilities(proba):
    class_labels = ["0-2", "3-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "more than 70"]
    result = []

    proba_list = proba[0].tolist()
    label_proba_pairs = zip(class_labels, proba_list)
    sorted_label_proba_pairs = sorted(label_proba_pairs, key=lambda x: x[1], reverse=True)

    for label, prob in sorted_label_proba_pairs:
        formatted_prob = float("{:.2f}".format(prob))
        result.append({"Label": label, "Probability": formatted_prob})

    return result



if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
