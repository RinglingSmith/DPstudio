const canvas = document.getElementById('drawboard');
const ctx = canvas.getContext('2d');

// Select the size input elements
const widthSlider = document.getElementById('width-range');
const heightSlider = document.getElementById('height-range');

// Resize canvas width and height based on slider values
function resizeCanvas() {
    // Update the canvas width and height
    canvas.width = widthSlider.value;
    canvas.height = heightSlider.value;

    // Optionally, clear the canvas after resizing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill the canvas with the current background color
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill canvas with color
}

// Add event listeners for the sliders to resize the canvas when changed
widthSlider.addEventListener('input', resizeCanvas);
heightSlider.addEventListener('input', resizeCanvas);

// Initialize canvas size when the page loads
resizeCanvas();
