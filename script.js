const canvas = document.getElementById('drawboard');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');

// Off-screen canvas
const drawingSurface = document.createElement('canvas');
const surfaceCtx = drawingSurface.getContext('2d');

// Initialize canvas
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawingSurface.width = 3000;
    drawingSurface.height = 3000;
    surfaceCtx.fillStyle = "#ffffff";
    surfaceCtx.fillRect(0, 0, drawingSurface.width, drawingSurface.height);
    drawSurface(); // Initial render
}
setupCanvas();
window.addEventListener('resize', setupCanvas);

// Drawing state
let isPainting = false;
let lastX = 0, lastY = 0;
let lineWidth = 5;
let brushColor = "#000";

// Zoom and pan
let scale = 1;
let originX = 0;
let originY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;

// Draw the visible canvas from the off-screen surface
function drawSurface() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, originX, originY);
    ctx.drawImage(drawingSurface, 0, 0);
}

// Draw to the off-screen canvas
function draw(e) {
    if (!isPainting) return;

    const x = (e.clientX - originX) / scale;
    const y = (e.clientY - originY) / scale;

    surfaceCtx.lineWidth = lineWidth;
    surfaceCtx.lineCap = 'round';
    surfaceCtx.strokeStyle = brushColor;

    surfaceCtx.beginPath();
    surfaceCtx.moveTo(lastX, lastY);
    surfaceCtx.lineTo(x, y);
    surfaceCtx.stroke();

    lastX = x;
    lastY = y;

    drawSurface(); // Update visible canvas
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 1 || e.ctrlKey) {
        isPanning = true;
        startPanX = e.clientX;
        startPanY = e.clientY;
    } else {
        isPainting = true;
        lastX = (e.clientX - originX) / scale;
        lastY = (e.clientY - originY) / scale;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        originX += (e.clientX - startPanX);
        originY += (e.clientY - startPanY);
        startPanX = e.clientX;
        startPanY = e.clientY;
        drawSurface();
    } else {
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    isPanning = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const x = (mouseX - originX) / scale;
    const y = (mouseY - originY) / scale;

    scale *= zoom;
    originX = mouseX - x * scale;
    originY = mouseY - y * scale;

    drawSurface();
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

// Clear
document.getElementById('clear').addEventListener('click', () => {
    surfaceCtx.fillStyle = document.getElementById('bg-color-picker').value || "#ffffff";
    surfaceCtx.fillRect(0, 0, drawingSurface.width, drawingSurface.height);
    drawSurface();
});

// Save image
document.querySelector('.save-img').addEventListener('click', () => {
    const image = drawingSurface.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas.png';
    link.click();
});

// Background color
document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    const color = e.target.value;
    // Fill only background (behind drawings)
    surfaceCtx.globalCompositeOperation = 'destination-over';
    surfaceCtx.fillStyle = color;
    surfaceCtx.fillRect(0, 0, drawingSurface.width, drawingSurface.height);
    surfaceCtx.globalCompositeOperation = 'source-over';
    drawSurface();
});

// Reset view
document.getElementById('reset-view').addEventListener('click', () => {
    scale = 1;
    originX = 0;
    originY = 0;
    drawSurface();
});
