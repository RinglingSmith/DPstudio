// Get references to the canvas and size controls
const canvas = document.getElementById('drawboard');
const ctx = canvas.getContext('2d');

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

// Event listeners to update the canvas size when input fields are changed
widthInput.addEventListener('input', resizeCanvas);
heightInput.addEventListener('input', resizeCanvas);

// Initial resize of canvas to match window size
resizeCanvas();

