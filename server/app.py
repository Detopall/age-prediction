from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

model = load_model('age-model.h5')

@app.route('/prediction', methods=['POST'])
def predict():
    image_file = request.files['image']
    image = Image.open(image_file)
    preprocessed_image = preprocess_image(image)
    age_prediction = model.predict(preprocessed_image)
    return jsonify({'age': float(age_prediction[0])})


def preprocess_image(image):
    resized_image = image.resize((120, 120))
    image_array = np.array(resized_image)
    normalized_image = image_array / 255.0
    preprocessed_image = np.expand_dims(normalized_image, axis=0)
    return preprocessed_image


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
