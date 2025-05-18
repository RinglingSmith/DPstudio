const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'round';
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left - offsetX) / scale,
        y: (evt.clientY - rect.top - offsetY) / scale
    };
}

function startPaint(evt) {
    painting = true;
    const pos = getMousePos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function endPaint() {
    painting = false;
    ctx.closePath();
}

function draw(evt) {
    if (!painting) return;
    const pos = getMousePos(evt);
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    switch (brushType) {
        case 'round':
        case 'square':
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            break;

        case 'spray':
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * brushSize;
                const x = pos.x + radius * Math.cos(angle);
                const y = pos.y + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;

        case 'marker':
            ctx.globalAlpha = 0.1;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            break;

        case 'fuzzy':
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * brushSize;
                const x = pos.x + radius * Math.cos(angle);
                const y = pos.y + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, 0.8, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;
    }
}

// ✅ Now we add the event listeners — outside the draw function
canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', endPaint);
canvas.addEventListener('mouseout', endPaint);
canvas.addEventListener('mousemove', draw);

// Control UI logic
document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('brushType').addEventListener('change', (e) => {
    brushType = e.target.value;
});

document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

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
