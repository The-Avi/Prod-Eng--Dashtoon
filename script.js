
async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
		{
			headers: { 
				"Accept": "image/png",
				"Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
				"Content-Type": "application/json" 
			},
			method: "POST",
			body: JSON.stringify(data),

    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate comic');
  }

  return response.blob();
}

const form = document.getElementById('comicForm');
const comicText = document.getElementById('comicText');
const comicStrip = document.getElementById('comicStrip');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = comicText.value.trim();
  if (text !== '') {
    try {
      const imageDataArray = await generateComicPanels(text);
      displayComic(imageDataArray);
    } catch (error) {
      showError('Failed to generate comic. Please try again.');
    }
  } else {
    showError('Please enter text for panels.');
  }
});

async function generateComicPanels(text) {
  const panels = [];
  for (let i = 0; i < 10; i++) {
    try {
      const imageData = await query({ "inputs": text });
      panels.push(imageData);
    } catch (error) {
      throw error;
    }
  }
  return panels;
}

function displayComic(imageDataArray) {
  clearComicStrip();
  imageDataArray.forEach((imageData, index) => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(imageData);
    img.alt = `Panel ${index + 1}`;
    img.classList.add('img-fluid', 'rounded', 'comic-panel');
    comicStrip.appendChild(img);
  });
}

function clearComicStrip() {
  comicStrip.innerHTML = '';
}

function showError(message) {
  const errorAlert = document.createElement('div');
  errorAlert.classList.add('alert', 'alert-danger', 'mt-3');
  errorAlert.textContent = message;

  const container = document.querySelector('.container');
  container.insertBefore(errorAlert, comicStrip);

  setTimeout(() => {
    errorAlert.remove();
  }, 5000);
}
