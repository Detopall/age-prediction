"use strict";

const imageInput = document.getElementById('image');
imageInput.addEventListener('change', handleImageChange);

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

function handleImageChange(e) {
	const imageFile = e.target.files[0];

	if (imageFile) {
		const imageURL = URL.createObjectURL(imageFile);
		const imagePreview = document.getElementById('image-preview');
		imagePreview.src = imageURL;
		imagePreview.style.display = 'block';
	} else {
		const imagePreview = document.getElementById('image-preview');
		imagePreview.src = '';
		imagePreview.style.display = 'none';
	}
}

function handleSubmit(e) {
	e.preventDefault();
	document.getElementById('result').innerHTML = `Loading...`;
	const form = e.target;
	const data = new FormData(form);

	fetch('http://localhost:5000/prediction', {
		method: 'POST',
		body: data,
	})
		.then((response) => response.json())
		.then((data) => {
			displayPredictionResults(data);
		})
		.catch((error) => {
			console.error('Error:', error);
			document.getElementById('result').innerHTML = `There is a problem. Please try again.`;
		});
}

function displayPredictionResults(data) {
	const resultContainer = document.getElementById('result');
	resultContainer.innerHTML = '';

	for (const entry of data) {
		const label = entry.Label;
		const probability = entry.Probability;

		let barColor = "";
		if (probability >= 0.4) {
			barColor = 'green';
		} else if (probability > 0.2) {
			barColor = 'orange';
		} else {
			barColor = 'red';
		}

		const percentage = `${(probability * 100).toFixed(2)}%`;

		const html = `
		<div class="bar-container ${barColor}">
			<span>${label} (${percentage})</span>
		</div>`	

		resultContainer.insertAdjacentHTML("beforeend", html);
	}
}
