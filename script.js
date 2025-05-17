const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 5;
let brushColor = '#000000';

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function startPaint(evt) {
    painting = true;
    const pos = getMousePos(canvas, evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function endPaint() {
    painting = false;
    ctx.closePath();
}

function draw(evt) {
    if (!painting) return;

    const pos = getMousePos(canvas, evt);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

// Brush color and size controls
document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

// Event listeners for painting
canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', endPaint);
canvas.addEventListener('mouseout', endPaint);
canvas.addEventListener('mousemove', draw);

// Clear Canvas Button
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save Drawing as PNG
document.getElementById('saveBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drawing.png';
    a.click();
});

