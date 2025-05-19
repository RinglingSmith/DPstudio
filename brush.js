// brush.js

let painting = false;
let brushSize = 5;
let brushColor = '#000000';
let brushType = 'round';

// Function to start painting
function startPaint(evt) {
    painting = true;
    const pos = getMousePos(evt);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Function to stop painting
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

// Function to draw on canvas
function draw(evt) {
    if (!painting) return;

    const pos = getMousePos(evt);
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = brushType === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = brushType === 'eraser' ? 'rgba(0,0,0,1)' : brushColor;
    ctx.fillStyle = ctx.strokeStyle;

    // Brush types logic (round, square, eraser, etc.)
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
        case 'spray':
        case 'fuzzy': {
            const dotSize = brushType === 'fuzzy' ? 0.8 : 1;
            const count = brushType === 'fuzzy' ? 20 : 20;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * brushSize;
                const x = pos.x + radius * Math.cos(angle);
                const y = pos.y + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
                ctx.fill();
            }
            break;
        }
        case 'pixel': {
            ctx.fillRect(pos.x, pos.y, brushSize, brushSize);
            break;
        }
        // Additional brush types as needed
        default:
            console.warn(`Unknown brush type: ${brushType}`);
    }
}

// Undo function
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

// UI controls for brush settings
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

document.getElementById('eraser').addEventListener('click', () => {
    brushType = (brushType === 'eraser') ? 'round' : 'eraser';
    const brushTypeSelector = document.getElementById('brushType');
    brushTypeSelector.value = brushType;
    brushTypeSelector.dispatchEvent(new Event('change'));
});

// Save the drawing as PNG or JPG
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

// Clear the canvas
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Keyboard shortcut for undo (Ctrl/Cmd + Z)
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
    }
});
