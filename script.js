const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

// Store drawing on a virtual canvas
const bufferCanvas = document.createElement('canvas');
const bufferCtx = bufferCanvas.getContext('2d');
bufferCanvas.width = canvas.width;
bufferCanvas.height = canvas.height;

let brushColor = '#000000';
let brushSize = 5;
let brushType = 'round';

let painting = false;
let panning = false;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let lastX = 0, lastY = 0;

// Utility: convert screen to canvas coordinates
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left - offsetX) / scale,
        y: (evt.clientY - rect.top - offsetY) / scale
    };
}

// Drawing logic
function startPainting(evt) {
    if (evt.button === 2) return; // skip right click
    painting = true;
    const pos = getMousePos(evt);
    lastX = pos.x;
    lastY = pos.y;
    bufferCtx.beginPath();
    bufferCtx.moveTo(pos.x, pos.y);
}

function draw(evt) {
    if (!painting) return;
    const pos = getMousePos(evt);
    bufferCtx.strokeStyle = brushColor;
    bufferCtx.fillStyle = brushColor;
    bufferCtx.lineWidth = brushSize;
    bufferCtx.lineCap = 'round';

    if (brushType === 'round' || brushType === 'square') {
        bufferCtx.lineTo(pos.x, pos.y);
        bufferCtx.stroke();
        bufferCtx.beginPath();
        bufferCtx.moveTo(pos.x, pos.y);
    } else if (brushType === 'spray') {
        const density = 30;
        for (let i = 0; i < density; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * brushSize;
            const x = pos.x + radius * Math.cos(angle);
            const y = pos.y + radius * Math.sin(angle);
            bufferCtx.beginPath();
            bufferCtx.arc(x, y, 1, 0, 2 * Math.PI);
            bufferCtx.fill();
        }
    }

    lastX = pos.x;
    lastY = pos.y;
    render(); // update screen
}

function stopPainting() {
    painting = false;
    bufferCtx.beginPath();
}

// Render buffer to visible canvas
function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    ctx.drawImage(bufferCanvas, 0, 0);
}

// Zoom
canvas.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    const zoomFactor = 0.1;
    const delta = evt.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;

    // Zoom toward mouse pointer
    const mouse = getMousePos(evt);
    offsetX -= mouse.x * (delta - 1);
    offsetY -= mouse.y * (delta - 1);
    scale *= delta;
    render();
});

// Pan
canvas.addEventListener('mousedown', (evt) => {
    if (evt.button === 2) {
        panning = true;
        lastX = evt.clientX;
        lastY = evt.clientY;
    } else {
        startPainting(evt);
    }
});
canvas.addEventListener('mousemove', (evt) => {
    if (panning) {
        const dx = evt.clientX - lastX;
        const dy = evt.clientY - lastY;
        offsetX += dx;
        offsetY += dy;
        lastX = evt.clientX;
        lastY = evt.clientY;
        render();
    } else {
        draw(evt);
    }
});
canvas.addEventListener('mouseup', (evt) => {
    if (panning) {
        panning = false;
    } else {
        stopPainting();
    }
});
canvas.addEventListener('mouseout', stopPainting);

// Prevent context menu on right click
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Tool controls
document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
});
document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});
document.getElementById('brushType').addEventListener('change', (e) => {
    brushType = e.target.value;
});
document.getElementById('clearBtn').addEventListener('click', () => {
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    render();
});
document.getElementById('savePngBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = bufferCanvas.toDataURL('image/png');
    link.click();
});
document.getElementById('saveJpgBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.jpg';
    link.href = bufferCanvas.toDataURL('image/jpeg');
    link.click();
});

// Initial draw
render();
