// brush.js

let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'round';

const canvas = document.getElementById('paintCanvas');
const ctx = canvas?.getContext('2d');

// Ensure context is available
if (!canvas || !ctx) {
    throw new Error("Canvas or context not found.");
}

// Function to get mouse position relative to the canvas
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / window.devicePixelRatio,
        y: (evt.clientY - rect.top) / window.devicePixelRatio
    };
}

// Function to start drawing
function startPaint(evt) {
    painting = true;
    const pos = getMousePos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Function to stop drawing
function endPaint() {
    if (!painting) return;
    painting = false;
    ctx.closePath();
}

// Function to draw with the brush
function draw(evt) {
    if (!painting) return;

    const pos = getMousePos(evt);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
    ctx.globalAlpha = 1.0;

    switch (brushType) {
        case 'round':
        case 'square':
        case 'eraser': {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, brushSize / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            break;
        }
        default:
            break;
    }
}

// Event listeners for mouse/touch interaction
canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', endPaint);
canvas.addEventListener('mouseout', endPaint);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPaint(e.touches[0]);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0]);
});
canvas.addEventListener('touchend', endPaint);
canvas.addEventListener('touchcancel', endPaint);

// UI Controls for brush size, color, and type
document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value, 10);
    ctx.lineWidth = brushSize;
});

document.getElementById('brushType').addEventListener('change', (e) => {
    brushType = e.target.value;
    ctx.lineWidth = brushSize;
});

// Clear the canvas
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save PNG or JPG
document.getElementById('savePngBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.png';
    a.click();
});

document.getElementById('saveJpgBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.jpg';
    a.click();
});

// Eraser toggle
document.getElementById('eraser').addEventListener('click', () => {
    brushType = brushType === 'eraser' ? 'round' : 'eraser';
    const brushTypeSelector = document.getElementById('brushType');
    brushTypeSelector.value = brushType;
    brushTypeSelector.dispatchEvent(new Event('change'));
});
