const canvas = document.getElementById('drawboard');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX, startY;
let lastX, lastY;

// Function to create smoother brush strokes
const draw = (e) => {
    if (!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.linecap = 'round';
    ctx.strokeStyle = ctx.strokeStyle || "#000";  // Default color if not set

    // Using quadraticCurveTo for smoother curves between points
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);  // Start point of the curve
    ctx.quadraticCurveTo(e.clientX, e.clientY, (lastX + e.clientX) / 2, (lastY + e.clientY) / 2);  // Control point and end point
    ctx.stroke();

    // Update lastX, lastY to current mouse position
    lastX = e.clientX;
    lastY = e.clientY;
};

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;

    lastX = startX;
    lastY = startY;
});

canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

// Event listener for the toolbar actions
toolbar.addEventListener('click', (e) => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});
