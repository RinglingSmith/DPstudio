const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'round';
let scale = 1;
let offsetX = 0;
let offsetY = 0;

let history = [];
let historyStep = -1;

function fixCanvasResolution() {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const oldData = canvas.toDataURL(); // Preserve existing drawing

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // Restore old drawing after resize
    const img = new Image();
    img.src = oldData;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left - offsetX) / scale,
        y: (evt.clientY - rect.top - offsetY) / scale
    };
}

function startPaint(evt) {
    painting = true;
    ctx.lineWidth = brushSize; // Apply brush size on paint start
    const pos = getMousePos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function endPaint() {
    if (!painting) return;
    painting = false;
    ctx.closePath();

    if (historyStep < history.length - 1) {
        history = history.slice(0, historyStep + 1);
    }

    history.push(canvas.toDataURL());
    historyStep++;
}

function draw(evt) {
    if (!painting) return;

    const pos = getMousePos(evt);
    ctx.lineWidth = brushSize;

    // Set initial blending and colors
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';

    if (brushType === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.strokeStyle = brushColor;
        ctx.fillStyle = brushColor;
    }

    switch (brushType) {
        case 'round':
        case 'square':
        case 'eraser':
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
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
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

        case 'calligraphy':
            const angle = Math.PI / 6;
            const dx = Math.cos(angle) * brushSize;
            const dy = Math.sin(angle) * brushSize;
            ctx.beginPath();
            ctx.moveTo(pos.x - dx, pos.y - dy);
            ctx.lineTo(pos.x + dx, pos.y + dy);
            ctx.stroke();
            break;

        case 'airbrush':
            for (let i = 0; i < 30; i++) {
                const a = Math.random() * 2 * Math.PI;
                const r = Math.random() * brushSize;
                const x = pos.x + r * Math.cos(a);
                const y = pos.y + r * Math.sin(a);
                ctx.globalAlpha = Math.random() * 0.2;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
            break;

        case 'pixel':
            ctx.fillRect(pos.x, pos.y, brushSize, brushSize);
            break;

        case 'mirrorX':
            const mirrorX = canvas.width / (window.devicePixelRatio || 1) - pos.x;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);

            ctx.beginPath();
            ctx.moveTo(mirrorX, pos.y);
            ctx.lineTo(mirrorX, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mirrorX, pos.y);
            break;

        case 'patternDot':
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.arc(pos.x + i, pos.y + i, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;

        default:
            console.warn(`Unknown brush type: ${brushType}`);
            break;
    }
}

// Get touch position relative to canvas
function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

// Start touch
function handleTouchStart(e) {
    e.preventDefault();
    const pos = getTouchPos(e);
    painting = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Draw on touch move
function handleTouchMove(e) {
    e.preventDefault();
    if (!painting) return;
    const pos = getTouchPos(e);
    draw({ clientX: pos.x, clientY: pos.y, isTouch: true });
}

// End touch
function handleTouchEnd(e) {
    e.preventDefault();
    if (!painting) return;
    painting = false;
    ctx.beginPath();
}

function undo() {
    if (historyStep > 0) {
        historyStep--;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Event Listeners
canvas.addEventListener("mousedown", startPaint);
canvas.addEventListener("mouseup", endPaint);
canvas.addEventListener("mouseout", endPaint);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

document.getElementById('colorPicker').addEventListener('input', e => {
    brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', e => {
    brushSize = parseInt(e.target.value, 10); 
    ctx.lineWidth = brushSize;
});

document.getElementById('brushType').addEventListener('change', e => {
    brushType = e.target.value;
    ctx.lineWidth = brushSize;
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

document.getElementById('eraser').addEventListener('click', () => {
    brushType = (brushType === 'eraser') ? 'round' : 'eraser';
    const brushTypeSelector = document.getElementById('brushType');
    brushTypeSelector.value = brushType;
    brushTypeSelector.dispatchEvent(new Event('change'));
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
    }
});

window.onload = () => {
    fixCanvasResolution();
    ctx.lineWidth = brushSize;

    history.push(canvas.toDataURL());
    historyStep = 0;

    document.getElementById('brushSize').value = brushSize;
    document.getElementById('colorPicker').value = brushColor;
    document.getElementById('brushType').value = brushType;
};

window.addEventListener('resize', fixCanvasResolution);
