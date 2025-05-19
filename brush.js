// brush.js

let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'round';

const canvas = document.getElementById('paintCanvas');
const ctx = canvas?.getContext('2d');

// Ensure the canvas context exists
if (!canvas || !ctx) {
    throw new Error("Canvas or context not found.");
}

// Get mouse position relative to the canvas
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
};
}

// Start painting
function startPaint(evt) {
    painting = true;
    const pos = getMousePos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Stop painting
function endPaint() {
    if (!painting) return;
    painting = false;
    ctx.closePath();
}

// Draw based on current brush settings
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

// Mouse and touch event listeners
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

// UI Controls for brush settings
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

// Clear canvas button
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setBackgroundColor('#FFFFFF'); // Reset the background color to white
});
