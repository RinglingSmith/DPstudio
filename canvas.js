// canvas.js

const canvas = document.getElementById('paintCanvas');
const ctx = canvas?.getContext('2d');

// Make sure canvas exists
if (!canvas || !ctx) {
    throw new Error("Canvas or context not found.");
}

// Set canvas size and fix resolution for high-DPI screens
function fixCanvasResolution() {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Preserve current drawing
    const oldData = canvas.toDataURL();

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // Redraw preserved content
    const img = new Image();
    img.src = oldData;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

// Handle background color change
function setBackgroundColor(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill the whole canvas with the background color
}

// Set up default background color to white
setBackgroundColor('#FFFFFF');

// Handle resize events
window.onload = () => {
    fixCanvasResolution();
};
window.addEventListener('resize', fixCanvasResolution);

// Event listener for setting the background color
document.getElementById('backgroundColor').addEventListener('input', (e) => {
    setBackgroundColor(e.target.value);
});
