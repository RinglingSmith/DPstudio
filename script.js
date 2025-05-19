const canvas = document.getElementById('drawboard');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

// Resize the canvas on load and on window resize
function resizeCanvas() {
    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = window.innerHeight - canvas.offsetTop;
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Refill the background when resizing
}

// Set initial canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Variables for drawing
let isPainting = false;
let lineWidth = 5;
let lastX, lastY;
let brushColor = "#000";  // Default brush color

let scale = 1;           // Zoom level
let originX = 0;         // Pan X offset
let originY = 0;         // Pan Y offset
let isPanning = false;
let startPanX, startPanY;

// Function to handle the smooth brush drawing
function draw(e) {
    if (!isPainting) return;

    const mouseX = (e.clientX - canvas.offsetLeft - originX) / scale;
    const mouseY = (e.clientY - canvas.offsetTop - originY) / scale;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.quadraticCurveTo(mouseX, mouseY, (lastX + mouseX) / 2, (lastY + mouseY) / 2);
    ctx.stroke();

    lastX = mouseX;
    lastY = mouseY;
}

function redrawCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(scale, 0, 0, scale, originX, originY);

    // Redraw background
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

    // Optionally redraw shapes, layers, etc., here if you track them separately
}


const widthInput = document.getElementById('canvas-width');
const heightInput = document.getElementById('canvas-height');
const applySizeButton = document.getElementById('apply-size');

applySizeButton.addEventListener('click', () => {
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);

    // Save current canvas content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    // Resize canvas
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Refill background color
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Restore previous content (scaled if new size is different)
    ctx.drawImage(tempCanvas, 0, 0);
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomFactor = 1.1;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = Math.pow(zoomFactor, direction);

    // Adjust pan so zoom is centered around cursor
    originX = mouseX - (mouseX - originX) * factor;
    originY = mouseY - (mouseY - originY) * factor;

    scale *= factor;
    redrawCanvas();
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 1 || e.ctrlKey) { // Middle click or Ctrl+Left
        isPanning = true;
        startPanX = e.clientX;
        startPanY = e.clientY;
    } else {
        isPainting = true;
        lastX = (e.clientX - canvas.offsetLeft - originX) / scale;
        lastY = (e.clientY - canvas.offsetTop - originY) / scale;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        const dx = e.clientX - startPanX;
        const dy = e.clientY - startPanY;
        originX += dx;
        originY += dy;
        startPanX = e.clientX;
        startPanY = e.clientY;
        redrawCanvas();
    } else {
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    isPanning = false;
});


// Mouse event listeners for painting
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

// Event listener for changing background color
document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    const newColor = e.target.value;
    canvas.style.backgroundColor = newColor;
    ctx.fillStyle = newColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Fill canvas with the new color
});

// Event listener for changing brush color from toolbar
toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        brushColor = e.target.value;  // Update the brush color
    }

    if (e.target.id === 'size-slider') {
        lineWidth = e.target.value;  // Update the line width
    }
});

// Event listener for clearing the canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';  // Reset background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save canvas as image
document.querySelector('.save-img').addEventListener('click', () => {
    const image = canvas.toDataURL();  // Convert canvas to image data
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    link.click();
});
