const canvas = document.getElementById('drawboard');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

// Resize the canvas on load and on window resize
function resizeCanvas() {
    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = window.innerHeight - canvas.offsetTop;
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Set initial canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing state
let isPainting = false;
let lineWidth = 5;
let lastX, lastY;
let brushColor = "#000";

// Zoom & Pan state
let scale = 1;
let originX = 0;
let originY = 0;
let isPanning = false;
let startPanX, startPanY;

// Handle drawing
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

// Redraw canvas for zoom/pan
function redrawCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(scale, 0, 0, scale, originX, originY);

    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

    // Note: If you store strokes, redraw them here.
}

// Zoom on mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomFactor = 1.1;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = Math.pow(zoomFactor, direction);

    originX = mouseX - (mouseX - originX) * factor;
    originY = mouseY - (mouseY - originY) * factor;

    scale *= factor;
    redrawCanvas();
});

// Pan and draw logic
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 1 || e.ctrlKey) {
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

// Canvas size changer
const widthInput = document.getElementById('canvas-width');
const heightInput = document.getElementById('canvas-height');
const applySizeButton = document.getElementById('apply-size');

applySizeButton.addEventListener('click', () => {
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(tempCanvas, 0, 0);
});

// Change background color
document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    const newColor = e.target.value;
    canvas.style.backgroundColor = newColor;
    ctx.fillStyle = newColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Brush settings
toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        brushColor = e.target.value;
    }
    if (e.target.id === 'size-slider') {
        lineWidth = e.target.value;
    }
});

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvas.style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save image
document.querySelector('.save-img').addEventListener('click', () => {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    link.click();
});

// Reset view (zoom & pan)
document.getElementById('reset-view').addEventListener('click', () => {
    scale = 1;
    originX = 0;
    originY = 0;
    redrawCanvas();
});

});
