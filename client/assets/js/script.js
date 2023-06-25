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
	const form = e.target;
	const data = new FormData(form);

	fetch('http://localhost:5000/prediction', {
		method: 'POST',
		body: data,
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			document.getElementById('result').innerHTML = `Predicted Age: ${parseInt(data.age)}`;
		})
		.catch((error) => {
			console.error('Error:', error);
			document.getElementById('result').innerHTML = `The image provided is not in a valid format or the server has a problem. Please try again.`;
		});
}
