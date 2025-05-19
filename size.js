// Get references to the canvas and size controls
const canvas = document.getElementById('drawboard');
const ctx = canvas.getContext('2d');
const resizeButton = document.getElementById('resize-canvas');
const resizeDialog = document.getElementById('resize-dialog');
const applyButton = document.getElementById('apply-size');
const cancelButton = document.getElementById('cancel-size');
const widthInput = document.getElementById('width-range');
const heightInput = document.getElementById('height-range');

// Function to resize the canvas
function resizeCanvas() {
    // Get the new width and height from the inputs
    const newWidth = widthInput.value;
    const newHeight = heightInput.value;

    // Update the canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Clear the canvas and optionally fill it with a background color
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';  // Default to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill canvas with color
}

// Event listener to show the resize dialog when the button is clicked
resizeButton.addEventListener('click', () => {
    // Pre-fill the input fields with the current canvas dimensions
    widthInput.value = canvas.width;
    heightInput.value = canvas.height;

    // Show the resize dialog
    resizeDialog.style.display = 'block';
});

// Event listener for applying the new size
applyButton.addEventListener('click', () => {
    resizeCanvas();
    resizeDialog.style.display = 'none';  // Hide the dialog after applying size
});

// Event listener for canceling the resize
cancelButton.addEventListener('click', () => {
    resizeDialog.style.display = 'none';  // Hide the dialog without changing the canvas size
});
