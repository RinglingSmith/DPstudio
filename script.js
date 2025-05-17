const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'round'; // default brush type
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

// Get mouse position relative to canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left - offsetX) / scale,
        y: (evt.clientY - rect.top - offsetY) / scale
    };
}

// Start painting (mousedown event)
function startPaint(evt) {
    painting = true;
    const pos = getMousePos(canvas, evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Stop painting (mouseup or mouseout event)
function endPaint() {
    painting = false;
    ctx.closePath();
}

// Draw on canvas (mousemove event)
function draw(evt) {
    if (!painting) return;

    const pos = getMousePos(canvas, evt);

    ctx.lineWidth = brushSize * scale;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    if (brushType === 'round') {
        ctx.lineTo(pos.x, pos.y);
    } else if (brushType === 'square') {
        ctx.lineTo(pos.x, pos.y);
    } else if (brushType === 'spray') {
        ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2, true);
        ctx.fill();
    }

    ctx.stroke();
}

// Update brush size and type
document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});
document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});
document.getElementById('brushType').addEventListener('change', (e) => {
    brushType = e.target.value;
});

// Clear canvas button
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save image as PNG
document.getElementById('savePngBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.png';
    a.click();
});

// Save image as JPG
document.getElementById('saveJpgBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.jpg';
    a.click();
});

// Mouse down, up, and move events for painting
canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', endPaint);
canvas.addEventListener('mouseout', endPaint);
canvas.addEventListener('mousemove', draw);

// Zoom in and out (scroll event)
canvas.addEventListener('wheel', (evt) => {
    if (evt.deltaY < 0) {
        scale += 0.1; // Zoom in
    } else {
        scale -= 0.1; // Zoom out
    }
    scale = Math.min(Math.max(scale, 0.5), 3); // Limit zoom scale
    ctx.setTransform(scale, 0, 0, scale, 0, 0); // Apply zoom transformation
});

// Pan canvas (mousedown, mousemove, and mouseup events)
canvas.addEventListener('mousedown', (evt) => {
    if (evt.button === 0) { // Left-click to pan
        isPanning = true;
        panStartX = evt.clientX;
        panStartY = evt.clientY;
    }
});
canvas.addEventListener('mousemove', (evt) => {
    if (isPanning) {
        offsetX += evt.clientX - panStartX;
        offsetY += evt.clientY - panStartY;
        panStartX = evt.clientX;
        panStartY = evt.clientY;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
        draw(evt); // Redraw
    }
});
canvas.addEventListener('mouseup', () => {
    isPanning = false;
});


