// canvas.js

const canvas = document.getElementById('paintCanvas');
const ctx = canvas?.getContext('2d');

// Ensure the canvas and context exist
if (!canvas || !ctx) {
    throw new Error("Canvas or context not found.");
}

// Set canvas size and fix resolution for high-DPI screens
function fixCanvasResolution() {
    const ratio = window.devicePixelRatio || 1; // Handle high-DPI screens
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Preserve current drawing
    const oldData = canvas.toDataURL();

    // Set new width and height based on screen resolution
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // Scale the context to match the new canvas resolution
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // Redraw preserved content
    const img = new Image();
    img.src = oldData;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

// Handle background color change
function setBackgroundColor(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill the entire canvas
}

// Set up default background color to white
setBackgroundColor('#FFFFFF');

// Event listener for setting the background color via color picker
document.getElementById('backgroundColor').addEventListener('input', (e) => {
    setBackgroundColor(e.target.value);
});

// Fix canvas resolution when the window is resized
window.onload = () => {
    fixCanvasResolution();
};
window.addEventListener('resize', fixCanvasResolution);

// Ensure the canvas is properly initialized
console.log("Canvas width:", canvas.width);
console.log("Canvas height:", canvas.height);
